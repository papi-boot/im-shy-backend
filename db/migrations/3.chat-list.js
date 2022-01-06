"use strict";
const { DataTypes } = require("sequelize");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("chat_list", {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("chat_list");
  },
};
