import { Server } from "socket.io";

import {
  createMessageService,
  markMessagesSeenService,
  markMessagesDeliveredService,
} from "../services/messageServices.js";

const socketHelper = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // JOIN USER ROOM
    socket.on("join", async (userId) => {
      try {
        //save the userId in socket
        const userChat = `user:${userId}`;

        //join the userChat
        socket.join(userChat);

        console.log(`User ${userId} joined`);

        // Mark old sent messages as delivered
        //Need await here because after updating the db we used it for changing the status
        const pendingMessages = await markMessagesDeliveredService(userId);

        // Tell senderIds that their messages are delivered
        for (const message of pendingMessages) {
          io.to(`user:${message.senderId}`).emit("messageStatusUpdate", {
            messageId: message.id,
            status: "delivered",
          });
        }
      } catch (error) {
        console.log("Join error:", error.message);
      }
    });

    // OPEN CHAT
    socket.on("openChat", ({ userId, otherUserId }) => {
      //save the userId and receiver id to check later whether the chat is opened or not
      const chatRoom = `chat:${userId}:${otherUserId}`;

      //join
      socket.join(chatRoom);

      console.log(`User ${userId} opened chat with ${otherUserId}`);
    });

    // CLOSE CHAT
    socket.on("closeChat", ({ userId, otherUserId }) => {
      //save the userId and receiver id to check later whether the chat is opened or not
      const chatRoom = `chat:${userId}:${otherUserId}`;

      //leave
      socket.leave(chatRoom);

      console.log(`User ${userId} closed chat with ${otherUserId}`);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        if (!text?.trim()) return;

        //call the service where the message creates
        const message = await createMessageService(senderId, receiverId, text);

        // Show message to senderId
        socket.emit("messageSent", message);

        const receiverRoom = `user:${receiverId}`;

        // Check if receiver is online and chat is opened
        const receiverSockets = await io.in(receiverRoom).fetchSockets();

        //means user is offline
        if (receiverSockets.length === 0) {
          return;
        }

        // Check if receiver has this chat open, create a variable chatRoom
        // where we put the receiverId & senderIdId to check whether the chat is opened or not
        const chatRoom = `chat:${receiverId}:${senderId}`;

        //Check whether the current chat is opened on receiver side or not
        // by fetching all the sockets and check the chatroom socket
        const chatSockets = await io.in(chatRoom).fetchSockets();

        //if open then it's length is greater than zero
        const isChatOpen = chatSockets.length > 0;

        // Set message status
        message.status = isChatOpen ? "seen" : "delivered";

        // Don't use await here because the message status is saved to the database.
        message.save();

        // Send message to receiver
        io.to(receiverRoom).emit("receiveMessage", message);

        // Update senderId status
        socket.emit("messageStatusUpdate", {
          messageId: message.id,
          status: message.status,
          receiverId,
        });
      } catch (error) {
        console.log("Send message error:", error.message);
      }
    });

    // MARK MESSAGES AS SEEN
    socket.on("markSeen", async ({ receiverId, senderId }) => {
      try {
        const seenMessages = await markMessagesSeenService(
          receiverId,
          senderId,
        );

        for (const message of seenMessages) {
          io.to(`user:${senderId}`).emit("messageStatusUpdate", {
            messageId: message.id,
            status: "seen",
          });
        }
      } catch (error) {
        console.log("Mark seen error:", error.message);
      }
    });

    socket.on("callUser", (data) => {
      console.log("CALL USER:", data);
      // Send everything to the receiver.
      // This can contain:
      // callerId + calleeId
      // OR
      // callerId + calleeId + offer
      // OR
      // callerId + calleeId + candidate
      io.to(`user:${data.calleeId}`).emit("incomingCall", data);
    });

    // ACCEPT CALL

    socket.on("acceptCall", (data) => {
      console.log("ACCEPT CALL:", data);

      // Send everything back to the caller.
      // This can contain:
      // callerId + calleeId
      // OR
      // callerId + calleeId + answer
      // OR
      // callerId + calleeId + candidate
      io.to(`user:${data.callerId}`).emit("callAccepted", data);
    });

    // REJECT CALL

    socket.on("rejectCall", (data) => {
      console.log("REJECT CALL:", data);

      io.to(`user:${data.callerId}`).emit("callRejected", data);
    });

    // END CALL

    socket.on("endCall", (data) => {
      console.log("END CALL:", data);

      // Send the end event to both users.
      io.to(`user:${data.callerId}`).emit("callEnd", data);

      io.to(`user:${data.calleeId}`).emit("callEnd", data);
    });
  });

  return io;
};

export default socketHelper;
