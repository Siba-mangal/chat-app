const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./userModule");
const Chat = sequelize.define(
  "Chat",
  {
    chatName: {
      type: Sequelize.STRING,
      allowNull: true,
      trim: true,
    },
    isGroupChat: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    latestMessage: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { timestamps: true }
);

module.exports = Chat;
