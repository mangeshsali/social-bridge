const express = require("express");
const DBConnection = require("./config/DBconnection");
const routes = require("./Routes/UserRoutes");
var cookieParser = require("cookie-parser");
const Requestrouter = require("./Routes/RequestRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);
app.use("/api/v1", Requestrouter);

try {
  DBConnection().then(() =>
    app.listen(3000, (req, res) => {
      console.log("Port Running 3000");
    })
  );
} catch (error) {
  console.log("Error in COnnection");
}
