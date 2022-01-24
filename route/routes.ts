import { RegisterController } from "../controller/register/register.controller";
import { LoginController } from "../controller/login/login.controller";
import { CookieController } from "../controller/cookie/cookie.controller";
import { AuthenticateController } from "../controller/authenticate/authenticate.controller";
import { MessageController } from "../controller/with-credentials/message/message.controller";
import { ChatController } from "../controller/with-credentials/chat/chat.controller";
import express from "express";
import passport from "passport";
new LoginController().loginPassportConfig(passport);
export class Routes {
  public routes: express.Router = express.Router();
  private registerController: RegisterController = new RegisterController();
  private loginController: LoginController = new LoginController();
  private cookieController: CookieController = new CookieController();
  private authenticateController: AuthenticateController = new AuthenticateController();
  private messageController: MessageController = new MessageController();
  private chatController: ChatController = new ChatController();
  // @TODO: ALL HTTP GET ROUTE
  public GET_REQUEST(): any {
    this.routes.get(
      this.authenticateController.AUTH_ROUTE,
      this.authenticateController.checkAuthenticated
    );
    this.routes.get(this.messageController.MESSAGE_ROUTE, this.messageController.readMessage);
    this.routes.get(this.authenticateController.LOGOUT_ROUTE, this.authenticateController.logOut);
    this.routes.get(this.chatController.ADD_CHAT_LIST_ROUTE, this.chatController.addChatList);
    this.routes.get(this.chatController.CHAT_LIST_ROUTE, this.chatController.readChatList);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public POST_REQUEST(): any {
    this.routes.post(this.registerController.REGISTER_ROUTE, this.registerController.createUser);
    this.routes.post(this.loginController.LOGIN_ROUTE, this.loginController.loginUser);
    this.routes.post(this.messageController.MESSAGE_ROUTE, this.messageController.createMessage);
    this.routes.post(this.chatController.CHAT_LIST_ROUTE, this.chatController.createChatList);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public PUT_REQUEST(): any {
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public DELETE_REQUEST(): any {
    this.routes.delete(this.messageController.MESSAGE_ROUTE, this.messageController.deleteMessage);
    this.routes.delete(
      this.messageController.DELETE_ALL_MESSAGE_ROUTE,
      this.messageController.deleteAllMessage
    );
    return this.routes;
  }
  public NOT_FOUND(): any {}
}
