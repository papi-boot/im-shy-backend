import { databaseHelper } from "../../utils/databaser.util";
import { ErrorHandler } from "../../middleware/error.handler";
import express from "express";
import { User } from "../../db/models/users";
import { SuccessHandler } from "../../middleware/success.handler";
export class AuthenticateController {
  public AUTH_ROUTE: string = "/authenticate";
  public LOGOUT_ROUTE: string = "/sign-out";
  private errorHandler: ErrorHandler = new ErrorHandler();
  private successHandler: SuccessHandler = new SuccessHandler();
  public checkAuthenticated = async (req: express.Request, res: express.Response) => {
    try {
      if (req.isAuthenticated()) {
        const result = await User.findOne({
          attributes: { exclude: ["password"] },
          where: { user_id: req.session.passport?.user },
        });
        return this.successHandler.successResponse(200, res, {
          message: "User Authenticated",
          success: true,
          isAuthenticated: true,
          ...result?.get({ plain: true }),
        });
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "Couldn't Authenticate the user",
          isAuthenticated: false,
          success: false,
        });
      }
    } catch (err) {
      return this.errorHandler.error400(err, res);
    }
  };

  public logOut = (req: express.Request, res: express.Response) => {
    try {
      if (req.isAuthenticated()) {
        req.logOut();
        req.session.destroy((err) => {
          if (err) {
            console.error(err);
            throw err;
          }
          res.clearCookie("connect.sid");
          return this.successHandler.successResponse(200, res, {
            message: "Logout Successfully",
            url: "/",
            success: true,
          });
        });
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "You are not authenticated. Please reload the page",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return this.errorHandler.error400(err, res);
    }
  };
}
