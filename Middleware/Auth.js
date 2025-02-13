const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

const Auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.send({ message: "Invalid Token" });
    }

    const DecodedToken = jwt.verify(token, "MangeshSali");

    const FindUser = await UserModel.findOne({ _id: DecodedToken });

    if (!FindUser) {
      return res.send({ message: "Invalid User" });
    }

    req.user = FindUser;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = Auth;
