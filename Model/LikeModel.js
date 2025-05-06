const { default: mongoose } = require("mongoose");

const LikeModel = mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeModel);
