import mongoose from "mongoose";
import modelList from "../constants/modelList";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      // lưu ID người dùng đang đăng nhập
      type: mongoose.Schema.Types.ObjectId,
      ref: modelList.user,
      required: true,
      index: true, // truy vấn nhanh hơn
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// tự động xóa khi hết hạn
sessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

const SessionModel = mongoose.model(modelList.session, sessionSchema);

export default SessionModel;
