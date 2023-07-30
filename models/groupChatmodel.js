const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./userModule");

const groupMessage = sequelize.define(
  "GroupMessage",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    sender: {
      type: Sequelize.STRING,
    },
    group: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = groupMessage;
