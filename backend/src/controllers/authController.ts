import bycrypt from "bcrypt";
import { Request, Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import UserModel from "../models/User";
import { handleError } from "../utils/handleError";

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
    if (password.length < 5 || password.length > 10) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Password phải từ 5 đến 10 ký tự",
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
    handleError(error, res, "signup");
  }
};

interface SignInBody {
  username: string;
  password: string;
}

export const signIn = async (
  req: Request<unknown, unknown, SignInBody>,
  res: Response,
) => {
  try {
    //  Lấy inputs
    const { password, username } = req.body;
    if (!username || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Thiếu username hoặc password.",
      });
    }
    // lấy hashedPassword trong db để so với password input
    const user = UserModel.findOne({ username });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "username hoặc password không chính xác",
      });
    }

    // Kiêm tra password
    // const passwordCorrect = await bycrypt.compare(
    //   password,
    //   user.hashedPassword,
    // );
    // nếu khớp, tạo accessToken với JWT

    // tạo refresh token

    // tạo session mới để lưu refresh token

    // trả refreshToken về trong cookies

    //
  } catch (error) {
    handleError(error, res, "signin");
  }
};
