const { default: mongoose } = require("mongoose");
const chatModel = require("../Model/ChatModel");
const UserModel = require("../Model/UserModel");
const MessageModel = require("../Model/MessageModel");

const ChatController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { targetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).send({ message: "Target Not Valid" });
    }

    const FindChatId = await chatModel.findOne({
      participants: { $all: [userId, targetId] },
    });

    if (!FindChatId) {
      return res.status(400).send({ message: "Chat Not Found" });
    }

    const FindTargetId = await UserModel.findById(targetId);

    if (!FindTargetId) {
      return res.status(400).send({ message: "Target User NOt Found" });
    }

    const ChatHistory = await MessageModel.find({
      chatId: FindChatId._id,
    })

      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).send({
      sucess: true,
      message: "Chat History",
      chatHistory: ChatHistory.reverse(),
    });
  } catch (error) {
    console.log("Error in Chat", error.message);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = ChatController;
