// models/groupMemberModel.js
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const grpModel = require("./grpModel");
const userModel = require("./userModule");

const GroupMember = sequelize.define("groupMember", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: grpModel,
      key: "id",
    },
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: userModel,
      key: "id",
    },
  },
  name: {
    type: Sequelize.STRING,
    required: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    default: false,
    required: false,
  },
});

module.exports = GroupMember;
