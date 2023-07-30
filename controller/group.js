const { Op } = require("sequelize");

const grpModel = require("../models/grpModel");
const memberModel = require("../models/groupMemberModel");
const groupMessage = require("../models/groupChatmodel");

exports.postGroups = async (req, res) => {
  try {
    // console.log(req.user.id);
    const grpData = await grpModel.create({
      creator_id: req.user.id,
      name: req.body.groupName,
      limit: req.body.limit,
    });
    // console.log(grpData);
    return res.status(200).send({ success: true, groups: grpData });
  } catch (error) {
    console.log(error);
  }
};

exports.loadGroups = async function (req, res) {
  try {
    const groups = await grpModel.findAll({
      where: { creator_id: req.user.id },
    });

    const response = await memberModel.findAll({
      where: { groupId: { $in: groups.map((group) => group.id) } },
    });
    // res.send({});

    const otherGrp = await memberModel.findAll({
      where: { userId: req.user.id },
    });
    // console.log(otherGrp);

    const promises = otherGrp.map(async (grp) => {
      const forCreatorId = await grpModel.findOne({
        where: { id: grp.groupId },
      });
      return forCreatorId; // Return the value to be stored in the result array
    });

    // Use Promise.all to wait for all the asynchronous operations to complete
    const forCreatorIds = await Promise.all(promises);
    // const resolvedForCreatorIds = await forCreatorIds;
    res.send({ groups, response, otherGrp, forCreatorIds });
  } catch (error) {
    console.log(error);
  }
};

exports.addMembers = async function (req, res) {
  // console.log(req.body);
  try {
    const { groupId, userId } = req.body;

    const memberPresent = await memberModel.findOne({
      where: { groupId: groupId, userId: userId },
    });
    const grp_name = await grpModel.findOne({ where: { id: groupId } });
    if (!memberPresent) {
      const addToDatabase = await memberModel.create({
        groupId: groupId,
        userId: userId,
        name: grp_name.name,
      });
      return res.status(200).send({ success: true, member: addToDatabase });
    } else {
      return res.send({ success: false, message: "User already added" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getMembers = async function (req, res) {
  // console.log(req.query.param);
  const allMembers = await memberModel.findAll({
    where: { groupId: req.query.param },
  });
  res.send({ success: true, allMembers });
};

exports.deleteMember = async function (req, res) {
  const delId = req.params.memberId.split(":")[1];

  const deleted = await memberModel.destroy({ where: { userId: delId } });
  res.status(200).send({ success: true, deleted });
};

exports.makeAdmin = async function (req, res) {
  // const id = req.params.id.split(":")[1];

  const admin = await memberModel.findOne({
    where: { userId: req.body.id, groupId: req.body.groupId },
  });
  admin.isAdmin = true;
  await admin.save();
  res.send({ success: true, admin });
};

exports.removeAdmin = async function (req, res) {
  const rmAdmin = await memberModel.findOne({
    where: { userId: req.body.id, groupId: req.body.groupId },
  });

  if (rmAdmin) {
    rmAdmin.isAdmin = false;
    await rmAdmin.save();
    res.send({ success: true, rmAdmin });
  } else {
    res.send({ success: false });
  }
};

exports.addMsgToGrp = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    // console.log(sender, groupId, message);
    const postMsg = await groupMessage.create({
      sender: sender,
      group: receiver,
      content: content,
    });
    res.status(200).send({ postMsg });
  } catch (error) {
    res.send({ error: error });
  }
};

exports.getGrpMsg = async (req, res) => {
  const sender = req.query.param1;
  const receiver = req.query.param2;
  const messages = await groupMessage.findAll({
    where: {
      group: receiver,
    },
    order: [["updatedAt", "ASC"]],
  });

  const projectedMessages = await messages.map((message) => {
    // console.log("message", typeof sender);
    return {
      fromSelf: message.sender === sender.toString(),
      message: message.content,
      sender: message.sender,
      receiver: message.receiver,
      id: message.id,
      updatedAt: message.updatedAt,
    };
  });

  return res.status(200).send({
    chats: projectedMessages,
    message: "All messages were successfully get",
  });
};
