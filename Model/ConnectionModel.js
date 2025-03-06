const { default: mongoose, Mongoose } = require("mongoose");

const ConnectionModel = mongoose.Schema(
  {
    fromUserId: {
      type: "String",
      ref: "user",
    },
    toUserId: {
      type: "String",
      ref: "user",
    },
    status: {
      type: "String",
      enum: ["ignored", "rejected", "accepted", "interested"],
      message: "{VALUE} Status Not Valid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Connection", ConnectionModel);
