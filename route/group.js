const express = require("express");
const path = require("path");
const groupController = require("../controller/group");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/add-group", auth.authenticate, groupController.postGroups);
router.get("/get-group", auth.authenticate, groupController.loadGroups);
router.post("/addMember", auth.authenticate, groupController.addMembers);
router.get("/get-member", auth.authenticate, groupController.getMembers);
router.post("/make-admin", auth.authenticate, groupController.makeAdmin);
router.post("/remove-admin", auth.authenticate, groupController.removeAdmin);
router.delete(
  "/delete-member/:memberId",
  auth.authenticate,
  groupController.deleteMember
);

router.post(
  "/send-grp-message",
  auth.authenticate,
  groupController.addMsgToGrp
);
router.get("/get-group-chats", auth.authenticate, groupController.getGrpMsg);
module.exports = router;
