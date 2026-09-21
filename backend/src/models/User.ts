import mongoose, { Schema, InferSchemaType, HydratedDocument } from "mongoose";
import validator from "validator";
import modelList from "../constants/modelList";

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

export type User = HydratedDocument<InferSchemaType<typeof userSchema>>;
const UserModel = mongoose.model(modelList.user, userSchema);
export default UserModel;
