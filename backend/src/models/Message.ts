import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
  },
  {
    timestamps: true, // tự động thêm biến createdAt, updatedAt
  },
);

// compound index: index kết hợp nhiều trường, 1: tăng dần, -1: giảm dần
messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
