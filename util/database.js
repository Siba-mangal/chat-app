const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.SQL_DATABASE_NAME,
  process.env.SQL_USERNAME,
  process.env.SQL_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.HOST_NAME,
  }
);

module.exports = sequelize;
