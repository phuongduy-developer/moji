import mongoose from "mongoose";
import modelList from "../constants/modelList";

interface IMessage {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  content: string;
  imgUrl: string;
}

// lưu từng tin nhắn giữa 2 người dùng
const messageSchema = new mongoose.Schema<IMessage>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.conversation,
      required: true,
      // index: true, // tối ưu tốc độ truy vấn theo hội thoại, đã dùng compound index r thì ko cần đánh index
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
    content: {
      type: String,
      trim: true, // tự động xoá khoảng trắng
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

const Message = mongoose.model(modelList.message, messageSchema);

export default Message;
