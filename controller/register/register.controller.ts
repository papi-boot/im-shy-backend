import { databaseHelper } from "../../utils/databaser.util";
import { Clean } from "../../middleware/clean";
import { UserModel } from "../../model/user";
import { ErrorHandler } from "../../middleware/error.handler";
import { QueryTypes } from "sequelize";
import bcrpyt from "bcryptjs";
import express from "express";
export class RegisterController {
  public REGISTER_ROUTE: string = "/sign-up";
  private errorHandler: ErrorHandler = new ErrorHandler();
  private clean: Clean = new Clean();

  public createUser = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { user_name, password, confirm_password } = req.body;
      const regexUserName = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
      // @Check if username is already existing
      const checkUserName: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_name = $1", {
        type: QueryTypes.SELECT,
        bind: [user_name],
      });
      if (!user_name.match(regexUserName) || user_name.length < 8 || !user_name)
        return this.errorHandler.errorGlobalResponse(400, res, { message: "Invalid Username", success: false });
      if (!password) return this.errorHandler.errorGlobalResponse(400, res, { message: "Password is required", success: false });
      if (password.length < 6)
        return this.errorHandler.errorGlobalResponse(400, res, {
          message: "Password should be atleast 8 characters long.",
          success: false,
        });
      if (confirm_password !== password)
        return this.errorHandler.errorGlobalResponse(400, res, { message: "Password don't matched", success: false });
      if (checkUserName.length > 0) {
        this.errorHandler.errorGlobalResponse(400, res, { message: "Username already exist", success: false });
      } else {
        const cleanUserName = await this.clean.cleanNow(user_name);
        const cleanPassword = await this.clean.cleanNow(password);
        const hashPassword = await bcrpyt.hash(cleanPassword, 10);
        const addNewUser = await databaseHelper.db.query(
          "INSERT INTO users(user_name, user_password, user_created_at, user_updated_at)VALUES($1,$2,$3,$4)",
          {
            type: QueryTypes.INSERT,
            bind: [cleanUserName, hashPassword, new Date(), new Date()],
          }
        );
        addNewUser;
        return res.status(200).json({ message: "Successfully registered.", success: true });
      }
    } catch (err) {
      console.error(err);
      this.errorHandler.error400(err, res);
    }
  };
}
