import bycrypt from "bcrypt";
import { Request, Response } from "express";
import HTTP_STATUS from "../constants/httpStatus";
import UserModel from "../models/User";
import { handleError } from "../utils/handleError";
import { sign } from "jsonwebtoken";
import crypto from "crypto";
import SessionModel from "../models/Session";

interface SignUpBody {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const ACCESS_TOKEN_TTL = "30m"; //thường là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

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
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "username hoặc password không chính xác",
      });
    }

    // Kiêm tra password
    const passwordCorrect = await bycrypt.compare(
      password,
      user.hashedPassword,
    );

    if (!passwordCorrect) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: "username hoặc password không chính xác",
      });
    }
    // nếu khớp, tạo accessToken với JWT
    const accessToken = sign(
      {
        userId: user._id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    /**
     * tại sao không lưu AT vào DB mà chỉ lưu mỗi RT thôi?
     * vì AT chỉ sống vài phút nên ko cần, còn RT sống lâu hơn nhiều nên
     * lỡ HACKER lỡ lấy RT thì chỉ cần xóa trong DB là sẽ tự động vô hiệu hóa
     * còn chỉ bọc trong JWT r gửi qua cookies thì khi bị đánh cắp sẽ ko có cách nào vô
     * hiệu hóa
     */
    // tạo session mới để lưu refresh token
    await SessionModel.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });

    // trả refreshToken về trong cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // KHÔNG THỂ BỊ TRUY CẬP BẰNG JS
      secure: true, // chỉ truy cập bằng https
      sameSite: "none", // backend, frontend deploy riêng, chung là strict
      maxAge: REFRESH_TOKEN_TTL,
    });
    // trả về accessToken về trong res
    return res.status(HTTP_STATUS.OK).json({
      message: `User ${user.displayName} đã logged in!`,
      accessToken,
    });
  } catch (error) {
    handleError(error, res, "signin");
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    // lấy refresh token từ cookie
    const token = req?.cookies?.refreshToken; // nhớ import cookie parser vào server.ts

    if (token) {
      // xóa refresh token trong session
      await SessionModel.deleteOne({
        refreshToken: token,
      });

      // xóa cookie
      res.clearCookie("refreshToken");
    }

    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    handleError(error, res, "signout");
  }
};
