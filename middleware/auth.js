const jwt = require("jsonwebtoken");
const User = require("../models/userModule");

const authenticate = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log(token);
    console.log(token.split(" ")[1]);
    let token2 = token.split(" ")[0];
    if (token2 === "Bearer" && token2 !== "undefined") {
      token2 = token.split(" ")[1];
    } else {
      token2 = token;
    }

    const user = jwt.verify(token2, "secretkey");
    console.log("userID >>>> ", user.userId);
    User.findByPk(user.userId).then((user) => {
      req.user = user; ///ver
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
    // err
  }
};

module.exports = {
  authenticate,
};
