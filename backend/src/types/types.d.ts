import type { User } from "../models/User";
import type { HydratedDocument } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<User>;
    }
  }
}

export {};
