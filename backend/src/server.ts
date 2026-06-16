import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/db";
import authRoute from "./routes/authRoute";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute";
import { protectedRoute } from "./middlewares/authMiddleware";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(cookieParser());
// public route (không cần đăng nhập)
app.use("/api/auth", authRoute);

// private route
app.use(protectedRoute);
app.use("/api/users", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server bắt đầu trên cổng ${PORT}`);
  });
});
