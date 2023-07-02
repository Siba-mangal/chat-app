const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      required: true,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_online: {
      type: Sequelize.STRING,
      default: "0",
    },
  },
  { timestamps: true }
);

module.exports = User;
