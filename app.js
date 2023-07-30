const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const session = require("express-session");
const http = require("http");
const socket = require("socket.io");
require("dotenv").config();

// const User = require("./models/userModule");
const userRoute = require("./route/user");
const chatRoute = require("./route/chat");
const grpRoute = require("./route/group");
//model
const User = require("./models/userModule");
const Message = require("./models/messageModel");
const grpModel = require("./models/grpModel");
const groupMemberModel = require("./models/groupMemberModel");
const grpChatModel = require("./models/groupChatmodel");

const app = express();
const { SESSION_SECRET } = process.env;
app.use(session({ secret: SESSION_SECRET }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.static("frontend"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/api", chatRoute);
app.use("/grp", grpRoute);

User.hasMany(Message);
Message.belongsTo(User);

// grpModel.hasMany(Message);
// Message.belongsTo(grpModel);

grpModel.hasMany(grpChatModel);
grpChatModel.belongsTo(grpModel);

groupMemberModel.hasMany(grpModel);
grpModel.belongsTo(groupMemberModel);

sequelize
  .sync()
  .then((res) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));
