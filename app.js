const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./util/database");
const session = require("express-session");
const http = require("http");
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

sequelize
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
