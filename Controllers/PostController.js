const { mongo, default: mongoose } = require("mongoose");
const CommentModel = require("../Model/CommentModel");
const PostModel = require("../Model/PostModel");
const UserModel = require("../Model/UserModel");
const PostCloudinary = require("../Utils/PostCloudinary");
const LikeModel = require("../Model/LikeModel");

const PostCreate = async (req, res) => {
  try {
    const { _id, firstName, lastName } = req.user;
    const { post } = req.body;
    const Files = req.file;

    console.log("File", Files);

    const FindUser = await UserModel.findOne({ _id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const ImageResp = await PostCloudinary(Files);

    // if (!ImageResp || !ImageResp.secure_url) {
    //   return res.status(500).send({ message: "Image Upload Failed" });
    // }

    const UserData = {
      userId: _id,
      post,
      Image: ImageResp?.secure_url || null,
    };

    const newPost = new PostModel(UserData);
    await newPost.save();
    res.status(200).send({ message: "Post Successfully Created" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const PostLike = async (req, res) => {
  try {
    const { _id } = req.user;

    const { id } = req.params;

    const FindUser = await UserModel.findOne({ _id });

    const Findpost = await PostModel.findOne({ _id: id });

    if (!Findpost) {
      return res.status(400).send({ message: "Post Not Found" });
    }
    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }

    const isLikedCheck = await LikeModel.findOne({
      postId: id,
      userId: _id,
    });

    if (!isLikedCheck) {
      const UpdatedPayload = {
        postId: Findpost._id,
        userId: _id,
      };
      const UpdatedPost = new LikeModel(UpdatedPayload);
      await UpdatedPost.save();

      const LikesCount = await LikeModel.countDocuments({ postId: id });

      const FindUpdatedPost = await PostModel.findByIdAndUpdate(
        { _id: id },
        { likeCount: LikesCount },
        { new: true }
      ).populate("userId", ["firstName", "lastName", "profile", "bio"]);

      return res.status(200).send({
        message: "Post Liked",
        post: FindUpdatedPost,
      });
    } else {
      await LikeModel.findByIdAndDelete({ _id: isLikedCheck._id });

      const FindUpdatedPost = await PostModel.findByIdAndUpdate(
        { _id: id },
        { $inc: { likeCount: -1 } },
        { new: true }
      ).populate("userId", ["firstName", "lastName", "profile", "bio"]);

      return res.status(200).send({
        message: "DisLiked",
        post: FindUpdatedPost,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const PostBYId = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }

    const FindPosts = await PostModel.findById(id).populate("userId", [
      "firstName",
      "lastName",
      "profile",
      "bio",
    ]);

    if (!FindPosts) {
      return res.status(400).send({ message: "Post Not Found" });
    }

    const FindIsPostLikebyUser = await LikeModel.exists({
      postId: id,
      userId: _id,
    });

    const ResultDataWithUserLike = {
      ...FindPosts._doc,
      isLike: !!FindIsPostLikebyUser,
    };

    res.status(200).send({
      success: true,
      message: "User Post",
      posts: ResultDataWithUserLike,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};
const CommentCreate = async (req, res) => {
  try {
    const { _id } = req.user;

    const { id } = req.params;

    const { comment } = req.body;

    if (!comment) {
      return res.status(400).send({ message: "Comment is Required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }

    const Findpost = await PostModel.findById(id);

    if (!Findpost) {
      return res.status(400).send({ message: "Post Not Found" });
    }

    const CommentData = {
      postId: id,
      comment,
      userId: _id,
    };

    const NewComment = new CommentModel(CommentData);
    let latestComment = await NewComment.save();
    latestComment.populate("userId", [
      "firstName",
      "lastName",
      "profile",
      "bio",
    ]);

    const FindCommentCount = await CommentModel.countDocuments({ postId: id });

    const FindUpdatedPost = await PostModel.findByIdAndUpdate(
      { _id: id },
      { $set: { commentCount: FindCommentCount } },
      { new: true }
    );

    res.status(201).json({ message: "Comment Added", comment: latestComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Error in comment", message: error.message });
  }
};

const CommentDelete = async (req, res) => {
  try {
    const { _id } = req.user;

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }

    const FindComment = await CommentModel.findById(id);

    if (!FindComment) {
      return res.status(400).send({ message: "Comment Not Found" });
    }

    if (FindComment.userId.toString() !== _id.toString()) {
      return res.status(400).send({ message: "Not Authorized" });
    }

    await CommentModel.findByIdAndDelete(id);

    const FindUpdatedComment = await PostModel.findByIdAndUpdate(
      { _id: FindComment.postId },
      { $inc: { commentCount: -1 } },
      { new: true }
    ).populate("userId", ["firstName", "lastName", "profile", "bio"]);

    res
      .status(201)
      .json({ message: "Comment Deleted", post: FindUpdatedComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Error in comment", message: error.message });
  }
};

const CommentLike = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    const FindUser = await UserModel.findById({ _id });

    const FindComment = await CommentModel.findById({ _id: id });

    if (!FindUser) {
      return res.status(400).send({ message: "User Not Found" });
    }
    if (!FindComment) {
      return res.status(400).send({ message: "Comment Not Found" });
    }

    const isLiked = FindComment.commentLike.includes(_id.toString());

    if (isLiked) {
      FindComment.commentLike = FindComment.commentLike.filter(
        (comment) => comment.toString() !== _id.toString()
      );
    } else {
      FindComment.commentLike.push(_id);
    }

    await FindComment.save();

    res.status(200).send({ message: "Comment Like", comment: FindComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const UserPost = async (req, res) => {
  try {
    const { _id } = req.user;

    const FindPosts = await PostModel.find({ userId: _id })
      .populate("userId", ["firstName", "lastName", "bio", "profile"])
      .lean();

    if (!FindPosts) {
      return res.status(400).send({ message: "Post Not Found" });
    }

    const currentUserLike = await Promise.all(
      FindPosts.map(async (post) => {
        const FindUserLike = await LikeModel.exists({
          postId: post._id,
          userId: _id,
        });
        return {
          ...post,
          isLike: !!FindUserLike,
        };
      })
    );

    res.status(200).send({ message: "User Post", posts: currentUserLike });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const PostDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const FindPost = await PostModel.findById({ _id: id });

    if (!FindPost) {
      return res.status(400).send({ message: "post not found" });
    }

    await PostModel.findByIdAndDelete({ _id: id });

    res.status(200).send({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const PostsComments = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }
    // const FindPost = await PostModel.findById(id).populate("userId", [
    //   "firstName",
    //   "lastName",
    //   "profile",
    //   "bio",
    // ]);

    // if (!FindPost) {
    //   return res.status(400).send({ message: "Post Not Found" });
    // }

    const FindComment = await CommentModel.find({ postId: id })
      .populate("userId", ["firstName", "lastName", "profile", "bio"])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!FindComment) {
      return res.status(400).send({ message: "Comments Not Found" });
    }

    // const { _id, ...rest } = FindPost._doc;

    // const UpdatedPost = {
    //   ...rest,
    //   postId: _id.toString(),
    //   comment: FindComment,
    // };

    res
      .status(200)
      .send({ success: true, message: "Comments ", comments: FindComment });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const PostsLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Post ID" });
    }

    const FindLikes = await LikeModel.find({ postId: id })
      .populate("userId", ["firstName", "lastName", "profile", "bio"])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (!FindLikes) {
      return res.status(400).send({ message: "Likes Not Found" });
    }

    res.status(200).send({ success: true, message: "Likes", likes: FindLikes });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  PostCreate,
  PostLike,
  CommentCreate,
  CommentDelete,
  CommentLike,
  UserPost,
  PostDelete,
  PostsComments,
  PostsLikes,
  PostBYId,
};
