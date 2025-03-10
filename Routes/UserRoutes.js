const express = require("express");
const {
  Signup,
  LogIn,
  Profile,
  LogOut,
  UpdateProfile,
  Updateinfo,
  feed,
} = require("../Controllers/UserControllers");
const Auth = require("../Middleware/Auth");
const upload = require("../Middleware/Upload");
const {
  ProjectCreate,
  ProjectList,
  ProjectDelete,
  ProjectUpdate,
} = require("../Controllers/ProjectController");
const {
  PostController,
  PostCreate,
  PostLike,
  CommentCreate,
  CommentLike,
  UserPost,
  PostDelete,
} = require("../Controllers/PostController");
const {
  GithubCreate,
  GithubDelete,
} = require("../Controllers/SocialConnectController");

const routes = express.Router();

routes.get("/home", (req, res) => {
  res.send({
    message: "Hemmo",
  });
});

routes.post("/signup", upload.single("profile"), Signup);
routes.post("/login", LogIn);
routes.post("/logout", Auth, LogOut);
routes.get("/profile", Auth, Profile);
routes.put("/uploadprofile", Auth, upload.single("profile"), UpdateProfile);
routes.put("/updateinfo", Auth, Updateinfo);
routes.get("/feed", Auth, feed);

// User Project

routes.post("/project", Auth, ProjectCreate);
routes.put("/project/:id", Auth, ProjectUpdate);
routes.get("/projectlist", Auth, ProjectList);
routes.delete("/deleteproject/:id", Auth, ProjectDelete);

//Post Routes

routes.post("/post", Auth, upload.single("Image"), PostCreate);
routes.get("/post", Auth, UserPost);
routes.post("/postlike/:id", Auth, PostLike);
routes.post("/comment/:id", Auth, CommentCreate);
routes.post("/commentlike/:id", Auth, CommentLike);
routes.delete("/post/:id", Auth, PostDelete);

// Social Connect
routes.post("/socialgithub", Auth, GithubCreate);
routes.delete("/socialgithub", Auth, GithubDelete);
module.exports = routes;
