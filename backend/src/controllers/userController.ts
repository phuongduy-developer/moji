import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import HTTP_STATUS from "../constants/httpStatus";

export const authMe = async (
  req: Request<unknown, unknown, unknown>,
  res: Response,
) => {
  try {
    return res.status(HTTP_STATUS.OK).json({
      message: "User",
    });
  } catch (error) {
    handleError(error, res, "signup");
  }
};
