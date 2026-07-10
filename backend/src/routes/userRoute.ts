import express from "express";
import { authMe, test } from "../controllers/userController";

const userRoute = express.Router();

userRoute.get("/me", authMe);
userRoute.get("/test", test);

export default userRoute;
