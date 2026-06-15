import { NextFunction, Request, Response } from "express";
import { handleError } from "../utils/handleError";
import HTTP_STATUS from "../constants/httpStatus";

export const protectedRoute = (
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

    //
  } catch (error) {
    handleError(error, res, "authMiddleware");
  }
};
