import mongoose from "mongoose";
import { Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";

interface MongoError extends Error {
  code: number;
  keyValue: Record<string, unknown>;
}
const isMongoError = (error: unknown): error is MongoError => {
  return error instanceof Error && "code" in error;
};

export const handleError = (
  error: unknown,
  res: Response,
  context?: string,
) => {
  // Lỗi validation của Mongoose
  if (error instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.entries(error.errors).map(([field, err]) => ({
      field,
      message: err.message,
    }));

    console.error(`[${context}] Lỗi validation:`, fieldErrors);

    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: "Dữ liệu không hợp lệ",
      errors: fieldErrors,
    });
  }

  // Lỗi duplicate key của MongoDB
  if (isMongoError(error) && error.code === 11000) {
    const keyValue = (error as any).keyValue;
    console.error(`[${context}] Lỗi duplicate:`, keyValue);

    return res.status(HTTP_STATUS.CONFLICT).json({
      message: "Dữ liệu đã tồn tại",
      errors: Object.keys(keyValue).map((field) => ({
        field,
        message: `${field} đã tồn tại`,
      })),
    });
  }

  // Lỗi hệ thống
  console.error(`[${context}] Lỗi hệ thống:`, error);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: "Lỗi hệ thống",
  });
};
