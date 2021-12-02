import { UserModel } from "../model/user";
declare module "express-session" {
  interface SessionData {
    user?: UserModel;
    passport?: object;
  }
}
declare global {
  namespace Express {
    interface User {
      user_id: string;
      user_name: string;
    }
  }
}
