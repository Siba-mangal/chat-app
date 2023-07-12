const User = require("../models/userModule");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const http = require("http");

exports.signUp = async (req, res, next) => {
  try {
    // console.log(req.body);
    const username = req.body.username;
    const phonenumber = req.body.phonenumber;
    const password = req.body.password;

    const user = await User.findOne({ where: { phone: phonenumber } });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      User.create({
        username: username,
        phone: phonenumber,
        password: hashPassword,
      }).then((response) => {
        res.status(201).json({ success: true, message: "Signup Successfully" });
      });
    } else {
      throw new Error("User already exits");
    }
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const generateToken = (id, name) => {
  return jwt.sign({ userId: id, username: name }, "secretkey");
};

exports.login = async (req, res) => {
  try {
    const io = require("socket.io")(http);
    let usp = io.of("/user-namespace");

    const { phonenumber, password } = req.body;
    console.log(phonenumber);
    console.log(password);
    const user = await User.findOne({ where: { phone: phonenumber } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        await usp.emit("userLoggedIn", { username: user.username });
        await usp.on("connection", function (socket) {
          console.log("User connected");

          // Handle disconnection event
          socket.on("disconnect", function () {
            console.log("User disconnected");

            // Emit "userDisconnected" event
            usp.emit("userDisconnected", { username: socket.username });
          });
        });
        return res.status(201).json({
          message: "Login successful",
          token: generateToken(user.id, user.username),
        });
      } else {
        throw new Error("Invalid Email or password");
      }
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
