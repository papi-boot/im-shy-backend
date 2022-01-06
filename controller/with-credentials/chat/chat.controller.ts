import { databaseHelper } from "../../../utils/databaser.util";
import { ErrorHandler } from "../../../middleware/error.handler";
import { SuccessHandler } from "../../../middleware/success.handler";
import { ChatListModel } from "../../../model/chat-list";
import express from "express";
import { QueryTypes } from "sequelize";
export class ChatController {
  public ADD_CHAT_LIST_ROUTE: string = "/add-chat-list";
  public CHAT_LIST_ROUTE: string = "/chat";
  private errorHandler: ErrorHandler = new ErrorHandler();
  private successHandler: SuccessHandler = new SuccessHandler();
  public addChatList = async (req: express.Request, res: express.Response) => {
    try {
      if (req.isAuthenticated()) {
        const checkChatList: Array<ChatListModel> = await databaseHelper.db.query(
          "SELECT * FROM chat_list WHERE chat_list_from = $1",
          {
            type: QueryTypes.SELECT,
            bind: [req.user.user_id],
          }
        );
        if (checkChatList.length > 0) {
          return this.successHandler.successResponse(200, res, {
            message: "c already",
            success: true,
          });
        } else {
          const insertChatList = await databaseHelper.db.query(
            "INSERT INTO chat_list(chat_list_from, chat_list_accepted_user, chat_list_created_at, chat_list_updated_at)VALUES($1,$2,$3,$4)",
            {
              type: QueryTypes.INSERT,
              bind: [req.user.user_id, "", new Date(), new Date()],
            }
          );
          insertChatList;
          return this.successHandler.successResponse(200, res, {
            message: "c created",
            success: true,
          });
        }
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "You are not Authorized",
          success: "false",
        });
      }
    } catch (err) {
      return this.errorHandler.error400(err, res);
    }
  };
}
