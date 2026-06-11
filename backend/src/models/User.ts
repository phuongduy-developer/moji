import mongoose, { Schema, InferSchemaType } from "mongoose";
import validator from "validator";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true, // mongoDB sẽ tự tạo index cho trường đó
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
      select: false, // ẩn khỏi query mặc định vì lý do bảo mật
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: "Email không đúng định dạng hợp lệ",
      },
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, //link CDN để hiển thị hình
    },
    avatarId: {
      type: String, // Cloundinary public_id để xóa hình
    },
    bio: {
      type: String,
      maxlength: 500, // tùy
    },
    phone: {
      type: String,
      sparse: true, // cho phép null, nhưng không được trùng
    },
  },
  {
    timestamps: true, // mongoose sẽ thêm 2 trường là createdAt và updatedAt
  },
);

export type User = InferSchemaType<typeof userSchema>;
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
