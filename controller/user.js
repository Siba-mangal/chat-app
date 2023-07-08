const User = require("../models/userModule");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    const user = await User.findOne({ where: { phone: phonenumber } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
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
