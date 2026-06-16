import { NextFunction, Request, Response } from "express";
import { handleError } from "../utils/handleError";
import HTTP_STATUS from "../constants/httpStatus";
import jwt, { type JwtPayload } from "jsonwebtoken";
import UserModel from "../models/User";

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "Không tìm thấy access token",
      });
    }

    //xác nhận token hợp lệ
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Access token hết hạn hoặc không đúng",
          });
        }

        if (typeof decodedUser === "string" || !decodedUser?.userId) {
          return res.status(HTTP_STATUS.FORBIDDEN).json({
            message: "Access token không hợp lệ",
          });
        }

        const { userId } = decodedUser as AccessTokenPayload;
        const user = await UserModel.findById(userId).select(
          "-hashedPassword -__v",
        );
        if (!user) {
          return res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "User không tồn tại",
          });
        }

        req.user = user;
        next();
      },
    );
  } catch (error) {
    handleError(error, res, "authMiddleware");
  }
};
// Có 2 cách để dùng middleware
// 1 là dùng trong server.ts
// 2 là từng route
