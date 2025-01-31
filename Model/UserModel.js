const { default: mongoose } = require("mongoose");

const UserModel = mongoose.Schema(
  {
    firstName: {
      type: "String",
      trim: true,
    },
    lastName: {
      type: "String",
      trim: true,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("user", UserModel);
