import express from "express";
import { authMe } from "../controllers/userController";

const userRoute = express.Router();

userRoute.get("/me", authMe);

export default userRoute;
