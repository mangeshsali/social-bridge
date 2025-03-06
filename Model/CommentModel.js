const { default: mongoose } = require("mongoose");

const CommentModel = mongoose.Schema(
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
    comment: {
      type: "String",
      required: true,
      trim: true,
    },
    commentLike: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentModel);
