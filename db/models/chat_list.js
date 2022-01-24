"use strict";
import { databaseHelper } from "../../utils/databaser.util";
const { DataTypes, Model, Sequelize } = require("sequelize");
export class ChatList extends Model {}
ChatList.init(
  {
    chat_list_id: {
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      type: DataTypes.UUID,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    chat_list_from: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    chat_list_accepted_user: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
    chat_list_created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    chat_list_updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    sequelize: databaseHelper.db,
    underscored: true,
    modelName: "chat_list",
    createdAt: "chat_list_created_at",
    updatedAt: "chat_list_updated_at",
  }
);
