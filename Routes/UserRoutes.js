const express = require("express");
const {
  Signup,
  LogIn,
  Profile,
  LogOut,
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

module.exports = routes;
