const express = require("express");
const Auth = require("../Middleware/Auth");
const {
  SendRequest,
  RequestReview,
  RequestAllReview,
  ConnectionsAll,
  FeedSuggestion,
} = require("../Controllers/ConnectionControllers");

const Requestrouter = express.Router();

Requestrouter.post("/request/send/:status/:toUserId", Auth, SendRequest);
Requestrouter.post("/request/review/:status/:requestId", Auth, RequestReview);
Requestrouter.get("/request/review", Auth, RequestAllReview);
Requestrouter.get("/connections", Auth, ConnectionsAll);
Requestrouter.get("/feed/", Auth, FeedSuggestion);

module.exports = Requestrouter;
