import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      ref: "User",
    },
  },
  {
    _id: false,
  },
);

const conversationSchema = new mongoose.Schema({
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
});
