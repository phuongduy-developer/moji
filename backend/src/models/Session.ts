import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      // lưu ID người dùng đang đăng nhập
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

const SessionModel = mongoose.model("Sesssion", sessionSchema);

export default SessionModel;
