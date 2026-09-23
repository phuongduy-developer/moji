import mongoose from "mongoose";
import HTTP_STATUS from "../constants/httpStatus";
import FriendModel from "../models/Friend";
import FriendRequestModel from "../models/FriendRequest";
import UserModel from "../models/User";
import { handleError } from "../utils/handleError";
import { Request, Response } from "express";

interface SendFriendBody {
  to: string;
  message: string;
}
export const sendFriendRequest = async (
  req: Request<unknown, unknown, SendFriendBody>,
  res: Response,
) => {
  try {
    const { message, to } = req.body;

    if (!to || !mongoose.isValidObjectId(to)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Người nhận không hợp lệ",
      });
    }

    const fromId = req.user?._id.toString();
    const toId  = to.toString();
    //  Kiểm tra có gửi lời mời cho chính mình hay ko
    if (fromId === toId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Không thể gửi lời mời kết bạn cho chính mình",
      });
    }

    // Kiểm tra xem có tồn tại người nhận lời mời kết bạn
    const userExist = await UserModel.exists({
      _id: toId,
    });

    if (!userExist) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: "Người dùng không tồn tại",
      });
    }

    let userA = fromId;
    let userB = toId;

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      FriendModel.findOne({ userA, userB }),
      FriendRequestModel.findOne({
        $or: [
          { from: fromId, to },
          { from: to, to: fromId },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Hai người đã là bạn bè",
      });
    }

    if (existingRequest) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Đã có lời mời kết bạn đang chờ",
      });
    }

    const request = await FriendRequestModel.create({
      from: fromId,
      to,
      message,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      message: "Gửi lời mời kết bạn thành công",
      request,
    });
  } catch (error) {
    handleError(error, res, "sendFriendRequest");
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    handleError(error, res, "acceptFriendRequest");
  }
};

export const declineFriendRequest = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    handleError(error, res, "declineFriendRequest");
  }
};

export const getAllFriends = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    handleError(error, res, "getAllFriends");
  }
};

export const getFriendRequests = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    handleError(error, res, "getFriendRequest");
  }
};
