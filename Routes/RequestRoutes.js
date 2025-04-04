const express = require("express");
const Auth = require("../Middleware/Auth");
const {
  SendRequest,
  RequestReview,
  RequestAllReview,
  ConnectionsAll,
  ConnectionSuggestion,
  ConnectionSearch,
} = require("../Controllers/ConnectionControllers");

const Requestrouter = express.Router();

Requestrouter.post("/request/send/:status/:toUserId", Auth, SendRequest);
Requestrouter.post("/request/review/:status/:requestId", Auth, RequestReview);
Requestrouter.get("/request/review", Auth, RequestAllReview);
Requestrouter.get("/connections", Auth, ConnectionsAll);
Requestrouter.get("/suggestion", Auth, ConnectionSuggestion);
Requestrouter.get("/searchconnection", Auth, ConnectionSearch);

module.exports = Requestrouter;
