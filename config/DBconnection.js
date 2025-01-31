const { connect } = require("mongoose");

const DBConnection = async () => {
  try {
    await connect("mongodb://127.0.0.1:27017/social-bridge");
    console.log("DB Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = DBConnection;
