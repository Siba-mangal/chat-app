const express = require("express");
const multer = require("multer");
const path = require("path");
const userController = require("../controller/user");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

router.post("/signup", upload.single("image"), userController.signUp);
router.post("/login", userController.login);

module.exports = router;
