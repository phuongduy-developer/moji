import { Request, Response } from "express";
import { handleError } from "../utils/handleError";
import HTTP_STATUS from "../constants/httpStatus";

export const authMe = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    return res.status(HTTP_STATUS.OK).json({
      user,
    });
  } catch (error) {
    handleError(error, res, "authMe");
  }
};
export const test = async (req: Request, res: Response) => {
  try {
    return res.status(HTTP_STATUS.OK).json({
      message: "test ok",
    });
  } catch (error) {
    handleError(error, res, "test");
  }
};
