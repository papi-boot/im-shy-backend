import { databaseHelper } from "../../utils/databaser.util";
import { QueryTypes } from "sequelize";
import { Strategy as LocalStrategy } from "passport-local";
import { ErrorHandler } from "../../middleware/error.handler";
import { SuccessHandler } from "../../middleware/success.handler";
import { UserModel } from "../../model/user";
import express from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
export class LoginController {
  public LOGIN_ROUTE: string = "/sign-in";
  private errorHandler: ErrorHandler = new ErrorHandler();
  private successHandler: SuccessHandler = new SuccessHandler();

  public loginPassportConfig(_passport: passport.Authenticator): any {
    _passport.use(
      new LocalStrategy(
        {
          usernameField: "username",
          passwordField: "password",
        },
        async (username, password, done) => {
          if (!username && !password) return done(null, false, { message: "Username or password is incorrect" });
          console.log(`Username: ${username}, Password: ${password}`);
          // @Check user if existing
          const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_name = $1", {
            type: QueryTypes.SELECT,
            bind: [username],
          });
          if (checkUser.length > 0) {
            bcrypt.compare(password, checkUser[0].user_password, (err, isMatched) => {
              if (err) throw err;
              if (isMatched) {
                return done(null, checkUser[0]);
              } else {
                return done(null, false, { message: "Password is incorrect" });
              }
            });
          } else {
            return done(null, false, { message: "Username does not exist" });
          }
        }
      )
    );
    _passport.serializeUser((user, done) => done(null, user.user_id));
    _passport.deserializeUser(async (user_id, done) => {
      const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_id = $1", {
        type: QueryTypes.SELECT,
        bind: [user_id],
      });
      if (checkUser.length > 0) {
        return done(null, checkUser[0]);
      } else {
        return done(null, false);
      }
    });
  }
  public loginUser = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<any> => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) return this.errorHandler.errorGlobalResponse(401, res, { message: "Incorrect Username or password", success: false });
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.session.cookie.maxAge = 360 * 24 * 60 * 60 * 1000;
        req.session.save();

        return this.successHandler.successResponse(200, res, { message: "Sign in successful", success: true });
      });
    })(req, res, next);
  };
}
