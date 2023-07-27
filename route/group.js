const express = require("express");
const path = require("path");
const groupController = require("../controller/group");
const auth = require("../middleware/auth.js");
const router = express.Router();

router.post("/group", auth.authenticate, groupController.postGroups);
router.get("/group", auth.authenticate, groupController.loadGroups);
router.post("/addMember", auth.authenticate, groupController.addMembers);
router.get("/get-member", auth.authenticate, groupController.getMembers);
router.delete(
  "/delete-member/:memberId",
  auth.authenticate,
  groupController.deleteMember
);

module.exports = router;
