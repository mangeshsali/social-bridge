const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, age, password } = req.body;

    if (!firstName || !lastName || !email || !gender || !age || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const UserAlready = await UserModel.findOne({ email: email });

    if (UserAlready) {
      return res.status(400).send({ message: "User Already Exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const User = {
      firstName,
      lastName,
      email,
      gender,
      age,
      password: passwordHash,
    };

    const UserData = new UserModel(User);
    await UserData.save();
    res.status(201).send({ message: "Sucessfully Send" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "All Field Required" });
    }

    const Findemail = await UserModel.findOne({ email });

    console.log(Findemail);

    if (!Findemail) {
      return res.status(400).send({ message: "Please Register First" });
    }

    const PasswordBcrypt = await bcrypt.compare(password, Findemail.password);

    if (!PasswordBcrypt) {
      return res.status(400).send({ message: "Invalid Credentials" });
    }

    const Token = jwt.sign(Findemail.id, "MangeshSali");
    res.cookie("token", Token);
    res.status(200).send({ messgae: "User Login Sucessfully" });
    req.user = Findemail;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const Profile = async (req, res) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
module.exports = { Signup, LogIn, Profile };
