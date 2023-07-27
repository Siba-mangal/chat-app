const { Op } = require("sequelize");

const grpModel = require("../models/grpModel");
const memberModel = require("../models/groupMemberModel");

exports.postGroups = async (req, res) => {
  try {
    // console.log(req.user.id);
    const grpData = await grpModel.create({
      creator_id: req.user.id,
      name: req.body.groupName,
      limit: req.body.limit,
    });
    // console.log(grpData);
    res.status(200).send({ success: true, groups: grpData });
  } catch (error) {
    console.log(error);
  }
};

exports.loadGroups = async function (req, res) {
  try {
    console.log(req.user.id);
    const groups = await grpModel.findAll({
      where: { creator_id: req.user.id },
    });
    if (groups.length > 0) {
      groups.forEach(async (group) => {
        console.log(group.id);
        await memberModel
          .findAll({ where: { groupId: group.id } })
          .then((response) => {
            res.send({ response, groups });
          })
          .catch((error) => {
            res.send(error);
          });
      });
    } else {
      const otherGrp = await memberModel.findAll({
        where: { userId: req.user.id },
      });
      res.send({ otherGrp });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addMembers = async function (req, res) {
  console.log(req.body);
  try {
    const { groupId, userId } = req.body;
    const memberPresent = await memberModel.findOne({
      where: { userId: userId },
    });
    const grp_name = await grpModel.findOne({ where: { id: groupId } });
    console.log(grp_name);
    if (!memberPresent) {
      const addToDatabase = await memberModel.create({
        groupId: groupId,
        userId: userId,
        name: grp_name.name,
      });
      res.status(200).send({ success: true, member: addToDatabase });
    } else {
      res.send({ success: false, message: "User already added" });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getMembers = async function (req, res) {
  console.log(req.query.param);
  const allMembers = await memberModel.findAll({
    where: { groupId: req.query.param },
  });
  res.send({ success: true, allMembers });
  console.log(allMembers);
};

exports.deleteMember = async function (req, res) {
  console.log(req.params.memberId);
  const delId = req.params.memberId.split(":")[1];

  const deleted = await memberModel.destroy({ where: { userId: delId } });
  res.status(200).send({ success: true, deleted });
};
