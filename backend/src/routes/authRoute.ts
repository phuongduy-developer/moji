import express from "express";
import {
  refreshToken,
  signIn,
  signOut,
  signUp,
} from "../controllers/authController";

const authRoute = express.Router();

authRoute.post("/signup", signUp);

authRoute.post("/signin", signIn);

authRoute.post("/signout", signOut);

authRoute.post("/refresh", refreshToken);

export default authRoute;
