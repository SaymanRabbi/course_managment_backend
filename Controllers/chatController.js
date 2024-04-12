const Chat = require("../models/ChatModel");

exports.createChat = async (req, res) => {
  // already exits reciver
  const conversationexit = await Chat.find({
    members: { $all: [req.body.senderId, req.body.receiverId] },
  }).select("-password");
  if (conversationexit.length > 0) {
    return res.status(400).send({
      status: false,
      message: "Conversation already exits",
    });
  }
  const chat = new Chat({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await chat.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.userChats = async (req, res) => {
  try {
    const result = await Chat.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.findChat = async (req, res) => {
  try {
    const result = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};
