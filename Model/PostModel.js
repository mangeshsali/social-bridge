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
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isLike: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

PostModel.index({ post: 1 });
module.exports = mongoose.model("post", PostModel);
