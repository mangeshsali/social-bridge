const UserModel = require("../Model/UserModel");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const ProfileCloudinary = require("../Utils/ProfileCloudinary");
require("dotenv").config();

const Signup = async (req, res) => {
  try {
    const { firstName, lastName, email, gender, age, password } = req.body;
    const file = req.file;

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!firstName || !lastName || !email || !gender || !age || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const UserAlready = await UserModel.findOne({ email: email });

    if (UserAlready) {
      return res.status(400).send({ message: "User Already Exist" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (file && file.size > 20 * 1024 * 1024) {
      return res
        .status(500)
        .send({ message: "Image Should be less than 20 MB" });
    }

    if (file) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res
          .status(400)
          .json({ message: "Only JPEG, JPG, and PNG files are allowed" });
      }
    }

    const profileUpload = await ProfileCloudinary(file, firstName, lastName);

    const User = {
      firstName,
      lastName,
      profile: profileUpload.secure_url,
      email,
      gender,
      age,
      password: passwordHash,
    };

    const UserData = new UserModel(User);
    await UserData.save();
    res.status(201).send({ message: "Sucessfully Created" });
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

    const Token = jwt.sign(Findemail.id, process.env.JWT_SECRET);
    res.cookie("token", Token);

    const SendUserData = {
      email: Findemail.email,
      firstName: Findemail.firstName,
      lastName: Findemail.lastName,
      profilePhoto: Findemail.profile,
    };
    res.status(200).send(SendUserData);
    // req.user = Findemail;
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const LogOut = async (req, res) => {
  try {
    res.clearCookie("token").send({ message: "Logout SucessFully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const Profile = async (req, res) => {
  try {
    const UserData = { ...req.user };
    delete UserData._doc.password;
    res.status(200).send(UserData._doc);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const file = req.file;
    const { firstName, lastName } = req.user;

    const ImageUpload = await ProfileCloudinary(file, firstName, lastName);

    res.status(200).send({ message: ImageUpload.secure_url });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = { Signup, LogIn, Profile, LogOut, UpdateProfile };
