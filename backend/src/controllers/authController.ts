import bycrypt from "bcrypt";
import { Request, Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import UserModel from "../models/User";

interface SignUpBody {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const signUp = async (
  req: Request<unknown, unknown, SignUpBody>,
  res: Response,
) => {
  try {
    const { email, firstName, lastName, password, username } = req.body;
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message:
          "Không thể thiếu username, password, email, firstName, và lastName",
      });
    }

    // kiểm tra username tồn tại chưa
    const duplicate = await UserModel.findOne({ username });
    if (duplicate) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        message: "username đã tồn tại",
      });
    }

    // mã hóa password
    const hashedPassword = await bycrypt.hash(password, 10); // salt = 10 trộn 2^10 lần, thực hiện mã hóa lặp đi lặp lại 2^10 lần = 200 ms, càng chậm hacker càng khó khăn tìm ra pw

    // tạo user mới
    await UserModel.create({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`,
    });

    // return
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    console.error("Lỗi khi gọi signUp", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
