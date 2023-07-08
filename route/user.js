const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../controller/user");

const router = express.Router();

router.post("/signup", userController.signUp);
router.post("/login", userController.login);

module.exports = router;
