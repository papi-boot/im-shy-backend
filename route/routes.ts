import { RegisterController } from "../controller/register/register.controller";
import { LoginController } from "../controller/login/login.controller";
import { CookieController } from "../controller/cookie/cookie.controller";
import { AuthenticateController } from "../controller/authenticate/authenticate.controller";
import express from "express";
import passport from "passport";
new LoginController().loginPassportConfig(passport);
export class Routes {
  public routes: express.Router = express.Router();
  private registerController: RegisterController = new RegisterController();
  private loginController: LoginController = new LoginController();
  private cookieController: CookieController = new CookieController();
  private authenticateController: AuthenticateController = new AuthenticateController();
  // @TODO: ALL HTTP GET ROUTE
  public GET_REQUEST(): any {
    this.routes.get("/check-cookie", this.cookieController.checkCookie);
    this.routes.get(
      this.authenticateController.AUTH_ROUTE,
      this.authenticateController.checkAuthenticated
    );
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public POST_REQUEST(): any {
    this.routes.post(this.registerController.REGISTER_ROUTE, this.registerController.createUser);
    this.routes.post(this.loginController.LOGIN_ROUTE, this.loginController.loginUser);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public PUT_REQUEST(): any {
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public DELETE_REQUEST(): any {
    return this.routes;
  }
  public NOT_FOUND(): any {}
}
