const express = require("express");
const path = require("path");
const chatController = require("../controller/chat");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.get("/allUser", auth.authenticate, chatController.getAccessUser);
router.post("/addChat", auth.authenticate, chatController.addChat);
router.get("/allChat", auth.authenticate, chatController.allAccessChat);

// router.post("/group", auth.authenticate, chatController.createGroupChat);
// router.put("/rename", auth.authenticate, chatController.renameGroup);
// router.put("/groupremove", auth.authenticate, chatController.removeFromGroup);
// router.put("/groupadd", auth.authenticate, chatController.addToGroup);

module.exports = router;
