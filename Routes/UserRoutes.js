const express = require("express");
const { Signup, LogIn, Profile } = require("../Controllers/UserControllers");
const Auth = require("../Middleware/Auth");

const routes = express.Router();

routes.get("/home", (req, res) => {
  res.send({
    message: "Hemmo",
  });
});

routes.post("/signup", Signup);
routes.post("/login", LogIn);
routes.get("/profile", Auth, Profile);

module.exports = routes;
