const { default: mongoose } = require("mongoose");

const ResetPassword = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    token: {
      type: "String",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const ResetPasswordModel = mongoose.model("ResetPassword", ResetPassword);
module.exports = ResetPasswordModel;
