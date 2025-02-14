const { connect } = require("mongoose");
require("dotenv").config();

const DBConnection = async () => {
  try {
    await connect(process.env.DATABASE);
    console.log("DB Connected");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = DBConnection;
