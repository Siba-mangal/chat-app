const express = require("express");
const path = require("path");
const userController = require("../controller/user");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

module.exports = router;
