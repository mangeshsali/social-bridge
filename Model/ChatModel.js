const { default: mongoose } = require("mongoose");

const ChatModel = mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const chatModel = mongoose.model("Chat", ChatModel);
module.exports = chatModel;
