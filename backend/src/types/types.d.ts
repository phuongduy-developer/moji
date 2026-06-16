import { User } from "../models/User";

// Dòng export {} này là BẮT BUỘC để TypeScript hiểu file này là một module
export {};

declare global {
  namespace Express {
    interface Request {
      user?: User; // Tốt nhất bạn nên import interface User của bạn vào đây thay vì dùng 'any'
    }
  }
}
