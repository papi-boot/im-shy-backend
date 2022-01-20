import { databaseHelper } from "../../../utils/databaser.util";
import { Clean } from "../../../middleware/clean";
import { ErrorHandler } from "../../../middleware/error.handler";
import { SuccessHandler } from "../../../middleware/success.handler";
import { ChatListModel } from "../../../model/chat-list";
import { QueryTypes } from "sequelize";
import { ChatList } from "../../../db/models/chat_list";
import express from "express";
import { v4 as uuid } from "uuid";
export class ChatController {
  public ADD_CHAT_LIST_ROUTE: string = "/add-chat-list";
  public CHAT_LIST_ROUTE: string = "/chat";
  private errorHandler: ErrorHandler = new ErrorHandler();
  private successHandler: SuccessHandler = new SuccessHandler();
  private c: Clean = new Clean();
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
              bind: [req.user.user_id, "[]", new Date(), new Date()],
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

  public createChatList = async (req: express.Request, res: express.Response) => {
    try {
      if (req.isAuthenticated()) {
        const { uid, d_name } = req.body;
        const checkChatList: Array<ChatListModel> = await databaseHelper.db.query(
          "SELECT * FROM chat_list WHERE chat_list_from = $1",
          {
            type: QueryTypes.SELECT,
            bind: [req.user.user_id],
          }
        );
        if (checkChatList.length > 0) {
          // @TODO: perform add user to chat accepted list
          const chatListAccepted: Array<any> = JSON.parse(checkChatList[0].chat_list_accepted_user);
          if (!d_name)
            return this.errorHandler.errorGlobalResponse(401, res, {
              message: "Display name is required",
              success: false,
            });
          // @TODO: check if the user unkown is already accepted
          if (chatListAccepted.findIndex((item) => item.a_uid === uid) > -1) {
            return this.successHandler.successResponse(200, res, {
              message: "Unknown user is already in your chat list",
              success: true,
            });
          } else {
            // @TODO: add user to your list
            const cleanDisplayName = await this.c.cleanNow(d_name);
            const chatLink = uuid();
            chatListAccepted.push({
              a_uid: uid,
              a_d_name: cleanDisplayName,
              a_c_link: chatLink,
            });
            console.log(chatListAccepted);
            // @TODO: insert for your list
            const acceptUnknowUserForYou = await databaseHelper.db.query(
              "UPDATE chat_list SET chat_list_accepted_user = $1, chat_list_updated_at = $2 WHERE chat_list_from = $3",
              {
                type: QueryTypes.UPDATE,
                bind: [JSON.stringify(chatListAccepted), new Date(), req.user.user_id],
              }
            );
            // @TODO: add yourself for uknown user chat list
            const checkUknownUserChatList: Array<ChatListModel> = await databaseHelper.db.query(
              "SELECT * FROM chat_list WHERE chat_list_from = $1",
              {
                type: QueryTypes.SELECT,
                bind: [uid],
              }
            );
            const unknownUserChatAcceptedArray: Array<any> = JSON.parse(
              checkUknownUserChatList[0].chat_list_accepted_user
            );
            unknownUserChatAcceptedArray.push({
              a_uid: checkChatList[0].chat_list_from,
              a_d_name: req.user.user_name,
              a_c_link: chatLink,
            });
            const addYourSelfForUknownUserChatList = await databaseHelper.db.query(
              "UPDATE chat_list SET chat_list_accepted_user = $1, chat_list_updated_at = $2 WHERE chat_list_from = $3",
              {
                type: QueryTypes.UPDATE,
                bind: [JSON.stringify(unknownUserChatAcceptedArray), new Date(), uid],
              }
            );
            acceptUnknowUserForYou;
            addYourSelfForUknownUserChatList;
            return this.successHandler.successResponse(200, res, {
              message: "Unkown user successfully added to your chat list",
              success: true,
            });
          }
        } else {
          return this.errorHandler.errorGlobalResponse(404, res, {
            message: "Could'nt add to chat list, Please relogin",
            success: false,
          });
        }
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "You are not Authorized to do such an operation",
          success: false,
        });
      }
    } catch (err) {
      return this.errorHandler.error400(err, res);
    }
  };

  public readChatList = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        const getMyChatList: Array<ChatListModel> = await databaseHelper.db.query(
          "SELECT * FROM chat_list WHERE chat_list_from = $1",
          {
            type: QueryTypes.SELECT,
            bind: [req.user.user_id],
          }
        );
        return this.successHandler.successResponse(200, res, {
          message: "Chat list fetched",
          success: true,
          ...getMyChatList[0],
        });
      } else {
        return this.errorHandler.errorGlobalResponse(402, res, {
          message: "You are not authorized",
          success: false,
        });
      }
    } catch (err) {
      return this.errorHandler.error400(err, res);
    }
  };
}
