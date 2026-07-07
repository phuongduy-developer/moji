import express from "express";
import { signIn, signOut, signUp } from "../controllers/authController";

const authRoute = express.Router();

authRoute.post("/signup", signUp);

authRoute.post("/signin", signIn);

authRoute.post("/signout", signOut);

export default authRoute;
