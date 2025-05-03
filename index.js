const express = require("express");
const { createServer } = require("http");
const DBConnection = require("./config/DBconnection");
const routes = require("./Routes/UserRoutes");
var cookieParser = require("cookie-parser");
const Requestrouter = require("./Routes/RequestRoutes");

require("dotenv").config();
const cors = require("cors");
const InitialSocket = require("./Utils/InitialSocket");

const app = express();
const server = createServer(app);
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
InitialSocket(server);

app.use("/api/v1", routes);
app.use("/api/v1", Requestrouter);

try {
  DBConnection().then(() =>
    server.listen(process.env.PORT, (req, res) => {
      console.log(`Port Running ${process.env.PORT}`);
    })
  );
} catch (error) {
  console.log("Error in COnnection");
}
