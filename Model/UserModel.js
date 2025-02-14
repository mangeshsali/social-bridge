const { default: mongoose } = require("mongoose");
var validator = require("validator");

const UserModel = mongoose.Schema(
  {
    firstName: {
      type: "String",
      trim: true,
    },
    lastName: {
      type: "String",
      trim: true,
    },
    profile: {
      type: "String",
      default:
        "https://res.cloudinary.com/dvzzmfhjl/image/upload/v1739568680/profile/irt3tuyqshdklijnj8.png",
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      lowercase: true,

      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Not Valid");
        }
      },
    },
    password: {
      type: "String",
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is Too Weak");
        }
      },
    },
    age: {
      type: "Number",
      min: 18,
    },
    gender: {
      type: "String",
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender",
      },
      required: true,
    },
    about: {
      type: "String",
      minLength: 10,
      maxLength: 100,
    },
    skills: {
      type: ["String"],
      default: undefined,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("user", UserModel);
