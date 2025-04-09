const { default: mongoose } = require("mongoose");

const PostModel = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    post: {
      type: "String",
      required: true,
      trim: true,
      // index: true,
    },
    Image: {
      type: "String",
    },
    Like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    Comment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    isLike: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

PostModel.index({ post: 1 });
module.exports = mongoose.model("post", PostModel);
