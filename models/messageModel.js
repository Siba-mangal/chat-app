const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./userModule");

const Message = sequelize.define(
  "Message",
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
    receiver: {
      type: Sequelize.STRING,
    },
    content: {
      // type: Sequelize.STRING,
      type: Sequelize.STRING,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = Message;
