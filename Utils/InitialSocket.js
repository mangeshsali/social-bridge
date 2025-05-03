const socket = require("socket.io");
const crypto = require("crypto");
const chatModel = require("../Model/ChatModel");

const InitialSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      // methods: ["GET", "POST"],
      // credentials: true,
    },
  });

  const generateRoomID = (userID, targetID) => {
    return crypto
      .createHash("sha256")
      .update([userID, targetID].sort().join("$"))
      .digest("hex");
  };

  io.on("connection", (socket) => {
    console.log("connected Socket");

    let CurrentRoomID = null;

    socket.on("join", ({ userID, targetID }) => {
      const RoomID = generateRoomID(userID, targetID);
      console.log("RomID", RoomID);

      if (CurrentRoomID) {
        socket.leave(CurrentRoomID);
      }

      socket.join(RoomID);
      CurrentRoomID = RoomID;
    });

    socket.on(
      "message",
      async ({ userID, targetID, text, firstName, lastName }) => {
        console.log("🏹", { userID, targetID, text });
        const RoomID = generateRoomID(userID, targetID);

        let Chat = await chatModel.findOne({
          participants: { $all: [userID, targetID] },
        });

        if (!Chat) {
          Chat = new chatModel({
            participants: [userID, targetID],
            messages: [],
          });
        }

        Chat.messages.push({
          senderId: userID,
          recieverId: targetID,
          text: text,
        });

        await Chat.save();

        io.to(RoomID).emit("recivedMessage", {
          userID,
          targetID,
          text,
          firstName,
          lastName,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    );
    socket.on("disconnect", () => {
      console.log("Disconnected Socket");
    });
  });
};

module.exports = InitialSocket;
