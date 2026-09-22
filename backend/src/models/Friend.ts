import mongoose, { Document } from "mongoose";
import modelList from "../constants/modelList";

interface IFriend extends Document {
  userA: mongoose.Types.ObjectId;
  userB: mongoose.Types.ObjectId;
}

const friendSchema = new mongoose.Schema<IFriend>(
  {
    userA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
    userB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Đoạn này sẽ chạy trước khi lưu dữ liệu vào database, save nghĩa là trước khi thực hiện hành động save,
// thì sẽ thực hiện logic trong fn

friendSchema.pre("save", function () {
  const a = this.userA.toString();
  const b = this.userB.toString();

  if (a > b) {
    this.userA = new mongoose.Types.ObjectId(b);
    this.userB = new mongoose.Types.ObjectId(a);
  }
});

friendSchema.index({ userA: 1, userB: 1 }, { unique: true });

const FriendModel = mongoose.model(modelList.friend, friendSchema);

export default FriendModel;
