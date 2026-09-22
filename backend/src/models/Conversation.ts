import mongoose from "mongoose";
import modelList from "../constants/modelList";

// Đại diện cho 1 cuộc hội thoại trong ứng dụng

//Mô tả thông tin cơ bản của người dùng trong cuộc trò chuyện. Tách ra để cho code dễ đọc hơn

export type ParticipantType = {
  userId: mongoose.Schema.Types.ObjectId;
  joinedAt: Date;
};

export type GroupType = {
  name: string;
  createdBy: mongoose.Schema.Types.ObjectId;
  avatarUrl?: string;
  avatarId?: string;
  backgroundUrl?: string;
  backgroundId?: string;
};
export type LastMessageType = {
  _id: string;
  content: string;
  senderId: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
};

export type ConversationType = {
  type: "direct" | "group";
  participants: ParticipantType[];
  group: GroupType;
  lastMessageAt: Date;
  seenBy: mongoose.Schema.Types.ObjectId[];
  lastMessage: LastMessageType;
  unreadCounts: Map<mongoose.Schema.Types.ObjectId, number>;
};

const participantSchema = new mongoose.Schema<ParticipantType>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false, // mongoose sẽ không tạo id cho từng phần tử, bỏi vì đây là 1 schema phụ trong conversation
  },
);

const groupSchema = new mongoose.Schema<GroupType>(
  {
    name: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
    },
    avatarUrl: {
      type: String, // link CDN để hiển thị ảnh đại diện nhóm
    },
    avatarId: {
      type: String, // Cloudinary public_id để xóa ảnh đại diện
    },
    backgroundUrl: {
      type: String, // link CDN ảnh nền nhóm
    },
    backgroundId: {
      type: String, // Cloudinary public_id để xóa ảnh nền
    },
  },
  {
    _id: false,
  },
);

const lastMessageSchema = new mongoose.Schema<LastMessageType>(
  {
    _id: {
      type: String, // id của tin nhắn gốc
    },
    content: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
    },
    createdAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const conversationSchema = new mongoose.Schema<ConversationType>(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    participants: {
      type: [participantSchema],
      required: true,
    },
    group: {
      type: groupSchema,
    },
    lastMessageAt: {
      type: Date,
    },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: modelList.user,
      },
    ],
    lastMessage: {
      type: lastMessageSchema,
      default: null,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

conversationSchema.index({
  "participants.userId": 1,
  lastMessageAt: -1,
});

const ConversationModel = mongoose.model(
  modelList.conversation,
  conversationSchema,
);
export default ConversationModel;
/**
 {
  "_id": "66f1conv001",
  "type": "direct",
  "participants": [
    { "userId": "66f1userA", "joinedAt": "2026-09-22T07:00:00.000Z" },
    { "userId": "66f1userB", "joinedAt": "2026-09-22T07:00:00.000Z" }
  ],
  "group": null,
  "lastMessageAt": "2026-09-22T07:30:00.000Z",
  "seenBy": ["66f1userA"],
  "lastMessage": {
    "_id": "66f1msg999",
    "content": "Hello",
    "senderId": "66f1userA",
    "createdAt": "2026-09-22T07:30:00.000Z"
  },
  "unreadCounts": {
    "66f1userA": 0,
    "66f1userB": 1
  },
  "createdAt": "2026-09-22T07:00:00.000Z",
  "updatedAt": "2026-09-22T07:30:00.000Z"
}
 */
