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
//model
const User = require("./models/userModule");
const Chat = require("./models/chatModel");
const Message = require("./models/messageModel");

const app = express();
const { SESSION_SECRET } = process.env;
app.use(session({ secret: SESSION_SECRET }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);
app.use("/api", chatRoute);

User.hasMany(Message);
Message.belongsTo(User);

let server;
sequelize
  .sync()
  .then((res) => {
    server = app.listen(3000);
  })
  .catch((err) => console.log(err));

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// global.onlineUsers = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsers.get(data.sender);
//     if (sendUserSocket) {
//       socket.sender(sendUserSocket).emit("msg-received", data.message);
//     }
//   });
// });
