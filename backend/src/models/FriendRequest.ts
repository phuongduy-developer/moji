import mongoose from "mongoose";
import modelList from "../constants/modelList";

interface IFriendRequest extends Document {
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  message: string;
}
const friendRequestSchema = new mongoose.Schema<IFriendRequest>(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
    message: {
      type: String,
      maxlength: 300,
    },
  },
  {
    timestamps: true,
  },
);

friendRequestSchema.index(
  {
    from: 1,
    to: 1,
  },
  {
    unique: true,
  },
);

// truy vấn nhanh các lời mời kết bạn đã gửi
friendRequestSchema.index({
  from: 1,
});

// truy vấn nhanh các lời mời kết bạn đã nhận
friendRequestSchema.index({
  to: 1,
});

const FriendRequestModel = mongoose.model(
  modelList.friendRequest,
  friendRequestSchema,
);

export default FriendRequestModel;
