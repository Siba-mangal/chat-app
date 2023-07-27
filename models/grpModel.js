const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const groupSchema = sequelize.define(
  "group",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    creator_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    limit: {
      type: Sequelize.INTEGER,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = groupSchema;
