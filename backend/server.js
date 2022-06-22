// Import Packages
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import mongoose from 'mongoose';

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Import environment config
require("dotenv/config");

// Common middleware
app.use(cors());

let allUsers = [];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("create", function (data) {
    const { userId, userName } = data;
    const socketId = socket.id;

    allUsers.push({
      socketId,
      userId,
      userName,
      userMessage: [],
    });

    socket.broadcast.emit("join", allUsers);
    socket.emit("join", allUsers);

  });

  socket.on("message", function (data) {
    const { loginMobileNo, chatUserId, messageText } = data;
    const senderData = allUsers.filter((user) => {
      return user.userId === loginMobileNo;
    });

    const receiverData = allUsers.filter((user) => {
        return user.userId === chatUserId;
      });

    if (senderData.length) {
        senderData[0].userMessage.push({
        senderId: loginMobileNo,
        receiverId:chatUserId,
        messageText,
        messageId: uuidv4(),
        messageTime: new Date(),
      });
    }

    if (receiverData.length) {
        receiverData[0].userMessage.push({
          senderId: loginMobileNo,
          receiverId:chatUserId,
          messageText,
          messageId: uuidv4(),
          messageTime: new Date(),
        });
      }

    
    io.emit("message", allUsers);
  });

  socket.on("disconnect", () => {
    const newUsers = allUsers.filter((user) => {
      return user.socketId !== socket.id;
    });
    allUsers = newUsers;
    socket.broadcast.emit("join", allUsers);
    console.log("Client disconnected...");
  });
});

//Port listening
server.listen(process.env.PORT || 8000, function () {
  // var port = server.address().port;
  console.log(
    `🚀 Server is running on http://localhost:${process.env.PORT || 8000}`
  );
});
