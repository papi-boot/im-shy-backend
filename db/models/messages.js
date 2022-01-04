"use strict";
import { databaseHelper } from "../../utils/databaser.util";
const { DataTypes, Model, Sequelize } = require("sequelize");
export class Messages extends Model {}
Messages.init(
  {
    message_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    message_from: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    message_to: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    message_body: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    message_created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    message_updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    sequelize: databaseHelper.db,
    underscored: true,
    modelName: "messages",
    createdAt: "message_created_at",
    updatedAt: "message_updated_at",
  }
);
