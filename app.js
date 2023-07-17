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
const Message = require("./models/messageModel");

const app = express();
const { SESSION_SECRET } = process.env;
app.use(session({ secret: SESSION_SECRET }));

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });
});

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

User.hasMany(Message);
Message.belongsTo(User);

sequelize
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
