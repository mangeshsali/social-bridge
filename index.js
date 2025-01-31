const express = require("express");
const DBConnection = require("./config/DBconnection");
const routes = require("./Routes/UserRoutes");

const app = express();

app.use("/api/v1", routes);

try {
  DBConnection().then(() =>
    app.listen(3000, (req, res) => {
      console.log("Port Running");
    })
  );
} catch (error) {
  console.log("Error in COnnection");
}
