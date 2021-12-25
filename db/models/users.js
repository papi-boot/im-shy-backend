"use strict";
import { databaseHelper } from "../../utils/databaser.util";
const { Model, Sequelize, DataTypes } = require("sequelize");
export class User extends Model {}
User.init(
  {
    user_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: Sequelize.literal("uuid_generate_v4()"),
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    user_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    user_updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    sequelize: databaseHelper.db,
    modelName: "users",
    createdAt: "user_created_at",
    updatedAt: "user_updated_at",
    underscored: true,
  }
);
return User;
