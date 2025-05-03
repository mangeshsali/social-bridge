const { default: mongoose } = require("mongoose");
const chatModel = require("../Model/ChatModel");
const UserModel = require("../Model/UserModel");

const ChatController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).send({ message: "Target Not Valid" });
    }

    const FindTargetId = await UserModel.findById(targetId);

    if (!FindTargetId) {
      return res.status(400).send({ message: "Target User NOt Found" });
    }

    const FindChats = await chatModel.findOne({
      participants: { $all: [userId, targetId] },
    });

    if (!FindChats) {
      const Chat = {
        participants: [userId, targetId],
        messages: [],
      };
      return res.status(200).send(Chat);
    }

    return res.status(200).send(FindChats);
  } catch (error) {
    console.log("Error in Chat", error.message);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = ChatController;
