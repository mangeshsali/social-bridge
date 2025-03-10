const { default: mongoose } = require("mongoose");
const ConnectionModel = require("../Model/ConnectionModel");
const UserModel = require("../Model/UserModel");

const SendRequest = async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const { _id } = req.user;

    const ALLOW_STATUS = ["ignored", "interested"];

    if (!ALLOW_STATUS.includes(status)) {
      return res
        .send({
          message:
            "Invalid status code. Allowed values are: 'ignored', 'interested'.",
        })
        .status(400);
    }
    const findtoUserId = await UserModel.findOne({ _id: toUserId });

    if (!findtoUserId) {
      return res
        .send({ message: "User not found for the provided connection ID." })
        .status(400);
    }

    const UserData = {
      fromUserId: _id,
      toUserId: toUserId,
      status: status,
    };

    if (toUserId == _id) {
      return res
        .send({ message: "You cannot Send Request to YourSelf" })
        .status(400);
    }

    const AlreadyPresentDB = await ConnectionModel.findOne({
      $or: [
        {
          fromUserId: _id,
          toUserId: toUserId,
        },
        { fromUserId: toUserId, toUserId: _id },
      ],
    });

    if (AlreadyPresentDB) {
      return res.send({ message: " Already Sended request" }).status(400);
    }
    const RequestData = new ConnectionModel(UserData);
    await RequestData.save();
    res
      .send({
        message: "Sucessfully Request Send",
      })
      .status(200);
  } catch (error) {
    res
      .send({
        error: error.message,
      })
      .status(400);
    console.log("Error in SendRequest", error.message);
  }
};

const RequestReview = async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const { _id } = req.user;
    const ALLOW_STATUS = ["accepted", "rejected"];

    if (!ALLOW_STATUS.includes(status)) {
      return res
        .send({
          message:
            "Invalid status code. Allowed values are: 'Accepted', 'rejected'.",
        })
        .status(400);
    }

    const FindReqId = await ConnectionModel.findOne({
      _id: requestId,
      toUserId: _id,
      status: "interested",
    });

    if (!FindReqId) {
      return res
        .send({
          message: "Invalid Request",
        })
        .status(400);
    }

    FindReqId.status = status;
    const Data = new ConnectionModel(FindReqId);
    await Data.save();
    res.send({ message: `${status} Sucessfully` }).status(200);
  } catch (error) {
    res
      .send({
        error: error.message,
      })
      .status(400);
    console.log("Error in RequestReview", error.message);
  }
};

const RequestAllReview = async (req, res) => {
  try {
    const { _id: LogInUserID } = req.user;

    const FindReq = await ConnectionModel.find({
      toUserId: LogInUserID,
      status: "interested",
    })
      .populate("fromUserId", ["firstName", "lastName", "profile"])
      .select(["fromUserId", "status"]);

    if (FindReq.length == 0) {
      return res.send({ message: "Request Not Found" });
    }
    res.status(200).send(FindReq);
  } catch (error) {
    res
      .send({
        error: error.message,
      })
      .status(400);
    console.log("Error in RequestAllReview", error.message);
  }
};

const ConnectionsAll = async (req, res) => {
  try {
    const { _id: LogInID } = req.user;

    const FindALLConnections = await ConnectionModel.find({
      $or: [
        { fromUserId: LogInID, status: "accepted" },
        { toUserId: LogInID, status: "accepted" },
      ],
    })
      .populate("toUserId", ["firstName", "lastName"])
      .populate("fromUserId", ["firstName", "lastName"])
      .select(["fromUserID", "toUserId"]);

    if (FindALLConnections.length === 0) {
      return res.status(200).send({ message: "No Connection Found" });
    }

    const updatedData = FindALLConnections.map((conn) => {
      if (conn.toUserId._id.toString() === LogInID.toString()) {
        return conn.fromUserId;
      }
      if (conn.fromUserId._id.toString() === LogInID.toString()) {
        return conn.toUserId;
      }
    });

    res.status(200).send(updatedData);
  } catch (error) {
    res
      .send({
        error: error.message,
      })
      .status(400);
  }
};

const ConnectionSuggestion = async (req, res) => {
  try {
    const { _id: LogInID } = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    const FindConnection = await ConnectionModel.find({
      $or: [{ fromUserId: LogInID }, { toUserId: LogInID }],
    });

    const ConnectionFilter = FindConnection.reduce((acc, curr) => {
      if (curr.fromUserId.toString() === LogInID.toString()) {
        acc.push(curr.toUserId);
      } else if (curr.toUserId.toString() === LogInID.toString()) {
        acc.push(curr.fromUserId);
      }
      return acc;
    }, []);

    const FindUser = await UserModel.find({
      _id: { $nin: [LogInID, ...ConnectionFilter] },
    })
      .skip(skip)
      .limit(limit)
      .select(["firstName", "lastName"]);

    if (FindUser.length === 0) {
      return res.send({ message: "No User Found" }).status(200);
    }

    res.send(FindUser);
  } catch (error) {
    res
      .send({
        error: error.message,
      })
      .status(400);
  }
};

module.exports = {
  SendRequest,
  RequestReview,
  RequestAllReview,
  ConnectionsAll,
  ConnectionSuggestion,
};
