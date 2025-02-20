const express = require("express");
const {
  Signup,
  LogIn,
  Profile,
  LogOut,
  UpdateProfile,
} = require("../Controllers/UserControllers");
const Auth = require("../Middleware/Auth");
const upload = require("../Middleware/Upload");

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

module.exports = routes;
