const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const chatSchema = sequelize.define(
  "chat",
  {
    sender_id: {
      type: Sequelize.DataTypes.STRING,
      ref: "User",
    },
    receiver_id: {
      type: Sequelize.DataTypes.STRING,
      ref: "User",
    },
    message: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = User;
