import { databaseHelper } from "../../../utils/databaser.util";
import { Clean } from "../../../middleware/clean";
import { ErrorHandler } from "../../../middleware/error.handler";
import { SuccessHandler } from "../../../middleware/success.handler";
import { User } from "../../../db/models/users";
import { Messages } from "../../../db/models/messages";
import { UserModel } from "../../../model/user";
import { QueryTypes } from "sequelize";
import express from "express";
import { MessageModel } from "../../../model/message";
export class MessageController {
  public MESSAGE_ROUTE: string = "/message";
  public DELETE_ALL_MESSAGE_ROUTE: string = "/all-message";
  private successHandler: SuccessHandler = new SuccessHandler();
  private errorHandler: ErrorHandler = new ErrorHandler();
  private clean: Clean = new Clean();
  public createMessage = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        const { reciever, message } = req.body;
        let recieverUserName: string = reciever;
        if (new String(reciever).includes("https", 0)) {
          if (new String(reciever).includes("https://www.im-shy.me/", 0)) {
            recieverUserName = new String(reciever).replace("https://www.im-shy.me/", "");
          } else {
            return this.errorHandler.errorGlobalResponse(400, res, {
              message: "Please check the Link provided",
              success: false,
            });
          }
        }
        // @TODO: Check if the user is exisiting;
        const checkUser: Array<UserModel> = await databaseHelper.db.query(
          "SELECT * FROM users WHERE user_name = $1",
          {
            type: QueryTypes.SELECT,
            bind: [recieverUserName],
          }
        );
        if (checkUser.length > 0) {
          const cleanMessage = await this.clean.cleanNow(message);
          // @TODO: Save the messages;
          const insertMessage = await databaseHelper.db.query(
            "INSERT INTO messages(message_from, message_to, message_body, message_created_at, message_updated_at)VALUES($1,$2,$3,$4,$5) RETURNING *;",
            {
              type: QueryTypes.INSERT,
              bind: [req.user.user_id, checkUser[0].user_id, cleanMessage, new Date(), new Date()],
            }
          );
          insertMessage;
          return this.successHandler.successResponse(200, res, {
            message: "Message sent.",
            success: true,
            r_id: checkUser[0].user_id,
          });
        } else {
          return this.errorHandler.errorGlobalResponse(404, res, {
            message: "User does not exist",
            success: false,
          });
        }
      } else {
        this.errorHandler.errorGlobalResponse(401, res, {
          message: "Not Authorized",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return this.errorHandler.error400(err, res);
    }
  };

  public readMessage = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        // @TODO: Get all message for each user
        const messages: Array<Messages> = await databaseHelper.db.query(
          "SELECT message_id, message_from, message_to, message_body, message_created_at, user_id FROM messages INNER JOIN users ON users.user_id = messages.message_to WHERE message_to = $1 ORDER BY message_created_at DESC",
          {
            type: QueryTypes.SELECT,
            bind: [req.user.user_id],
          }
        );
        return this.successHandler.successResponse(200, res, {
          message: "Message fetched",
          success: true,
          messages,
        });
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "Not Authorized",
          success: false,
        });
      }
    } catch (err) {
      return this.errorHandler.error400(err, res);
    }
  };

  public deleteMessage = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        const { message_id } = req.body;
        const checkMessage: Array<MessageModel> = await databaseHelper.db.query(
          "SELECT * FROM messages WHERE message_id = $1",
          {
            type: QueryTypes.SELECT,
            bind: [message_id],
          }
        );
        if (checkMessage.length > 0) {
          const deleteMessage = await Messages.destroy({
            where: { message_id: checkMessage[0].message_id },
          });
          return this.successHandler.successResponse(200, res, {
            message: "Message deleted",
            success: true,
          });
        } else {
          return this.errorHandler.errorGlobalResponse(404, res, {
            message:
              "Message not found. It's either already deleted or please try reloading the page",
            success: false,
          });
        }
      } else {
        return this.errorHandler.errorGlobalResponse(401, res, {
          message: "Not Authorized",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return this.errorHandler.error400(err, res);
    }
  };

  public deleteAllMessage = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        const checkMessage: Array<MessageModel> = await databaseHelper.db.query(
          "SELECT * FROM messages WHERE message_to = $1",
          {
            type: QueryTypes.SELECT,
            bind: [req.user.user_id],
          }
        );
        if (checkMessage.length > 0) {
          const deleteAllMessage = Messages.destroy({ where: { message_to: req.user.user_id } });
          return this.successHandler.successResponse(200, res, { message: "All message deleted.", success: true });
        } else {
          return this.errorHandler.errorGlobalResponse(404, res, {
            message: "You don't have any message. Please reload the page",
            success: false,
          });
        }
      } else {
      }
    } catch (err) {
      console.error(err);
    }
  };
}
