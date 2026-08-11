import { Server } from "socket.io";

import {
  createMessageService,
  markMessagesSeenService,
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
    socket.on("join", (userId) => {
      const room = `user:${userId}`;

      socket.join(room);

      console.log(`User ${userId} joined`);
    });

    // OPEN CHAT
    socket.on("openChat", ({ userId, otherUserId }) => {
      const room = `chat:${userId}:${otherUserId}`;

      socket.join(room);

      console.log(`User ${userId} opened chat with ${otherUserId}`);
    });

    // CLOSE CHAT
    socket.on("closeChat", ({ userId, otherUserId }) => {
      const room = `chat:${userId}:${otherUserId}`;

      socket.leave(room);

      console.log(`User ${userId} closed chat with ${otherUserId}`);
    });

    // SEND MESSAGE
    socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
      try {
        if (!text?.trim()) {
          return;
        }

        // 1. Save message
        const message = await createMessageService(senderId, receiverId, text);

        // 2. Send saved message back to sender
        socket.emit("messageSent", message);

        // Receiver's personal room
        const receiverRoom = `user:${receiverId}`;

        // 3. Check if receiver is connected
        const receiverSockets = await io.in(receiverRoom).fetchSockets();

        // Receiver is offline
        if (receiverSockets.length === 0) {
          return;
        }

        // RECEIVER IS ONLINE
        const chatRoom = `chat:${receiverId}:${senderId}`;

        // 4. Check if receiver has this chat open
        const chatSockets = await io.in(chatRoom).fetchSockets();

        // CHAT IS OPEN
        if (chatSockets.length > 0) {
          message.status = "seen";

          await message.save();

          // Send message to receiver
          io.to(receiverRoom).emit("receiveMessage", message);

          // Update sender
          socket.emit("messageStatusUpdate", {
            messageId: message._id,
            status: "seen",
          });

          return;
        }

        // CHAT IS NOT OPEN
        message.status = "delivered";

        await message.save();

        // Send message to receiver
        io.to(receiverRoom).emit("receiveMessage", message);

        // Update sender
        socket.emit("messageStatusUpdate", {
          messageId: message._id,
          status: "delivered",
        });
      } catch (error) {
        console.log("Send message error:", error.message);
      }
    });

    // MARK MESSAGES AS SEEN
    socket.on("markSeen", async ({ receiverId, senderId }) => {
      try {
        // Update MongoDB
        await markMessagesSeenService(receiverId, senderId);

        // Tell sender
        io.to(`user:${senderId}`).emit("messageStatusUpdate", {
          senderId,
          receiverId,
          status: "seen",
        });
      } catch (error) {
        console.log("Mark seen error:", error.message);
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export default socketHelper;
