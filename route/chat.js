const express = require("express");
const path = require("path");
const chatController = require("../controller/chat");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/chat", auth.authenticate, chatController.accessChat);
router.get("/dashboard", auth.authenticate, chatController.getAccessChat);
// router.post("/group", auth.authenticate, chatController.createGroupChat);
// router.put("/rename", auth.authenticate, chatController.renameGroup);
// router.put("/groupremove", auth.authenticate, chatController.removeFromGroup);
// router.put("/groupadd", auth.authenticate, chatController.addToGroup);

module.exports = router;
