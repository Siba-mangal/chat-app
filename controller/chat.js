const asyncHandler = require("express-async-handler");
const { Op } = require("sequelize");

const User = require("../models/userModule");
const Message = require("../models/messageModel");

// exports.accessChat = asyncHandler(async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     console.log("UserId param not sent with request");
//     return res.sendStatus(400);
//   }
//   const isChat = await Chat.findAll({
//     where: {
//       isGroupChat: false,
//       [Op.and]: [
//         { users: { [Op.contains]: [req.user.id] } },
//         { users: { [Op.contains]: [userId] } },
//       ],
//     },
//     include: [
//       {
//         model: Message,
//         include: [
//           {
//             model: User,
//             attributes: ["username", "phone"],
//             as: "sender",
//           },
//         ],
//       },
//     ],
//   });

//   if (isChat.length > 0) {
//     console.log(isChat[0]);
//     res.send(isChat[0]);
//   } else {
//     var chatData = {
//       chatName: "sender",
//       isGroupChat: false,
//       users: [req.user.id, userId],
//     };
//     try {
//       const createChat = await Chat.create(chatData);

//       const fullChat = await Chat.findOne({
//         where: { id: createChat.id },
//         include: [
//           {
//             model: User,
//             attributes: { exclude: ["password"] },
//           },
//         ],
//       });
//       res.status(200).json(fullChat);
//     } catch (error) {
//       res.status(400);
//       throw new Error(error.message);
//     }
//   }
// });

// -------------------------------

exports.accessChat = async (req, res) => {
  // console.log(req.body);
  const { sender, receiver, content } = req.body;
  try {
    console.log(req.user.id);
    const message = await Message.create({
      sender: sender,
      receiver: receiver,
      content: content,
      UserId: req.user.id,
    });

    if (message) {
      res.status(200).send("Message added successfully");
    } else {
      throw new Error("Couldn't add message");
    }

    console.log(message);
  } catch (error) {
    res.status(401).send(error.message);
  }
};
exports.getAccessChat = async (req, res) => {
  const user = await User.findAll({
    where: { id: { [Op.notIn]: [req.user.id] } },
  });
  // const user = await User.findAll({ id: [req.user.id] });
  res.status(200).send({ users: user });
  // console.log(user);
};
