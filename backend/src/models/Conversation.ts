import mongoose from "mongoose";
import modelList from "../constants/modelList";

// Đại diện cho 1 cuộc hội thoại trong ứng dụng

//Mô tả thông tin cơ bản của người dùng trong cuộc trò chuyện. Tách ra để cho code dễ đọc hơn
const participantSchema = new mongoose.Schema(
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

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
    },
  },
  {
    _id: false,
  },
); // nếu cần thêm ảnh đại diện thì thêm, ảnh nền

const lastMessageSchema = new mongoose.Schema(
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

const conversationSchema = new mongoose.Schema(
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
