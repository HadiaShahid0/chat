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


    // =========================
    // JOIN USER ROOM
    // =========================

    socket.on("join", (userId) => {
      const room = `user:${userId}`;

      socket.join(room);

      console.log(
        `User ${userId} joined their room`
      );
    });


    // =========================
    // OPEN CHAT
    // =========================

    socket.on(
      "openChat",
      ({ userId, otherUserId }) => {
        const room = `chat:${userId}:${otherUserId}`;

        socket.join(room);

        console.log(
          `User ${userId} opened chat with ${otherUserId}`
        );
      }
    );


    // =========================
    // CLOSE CHAT
    // =========================

    socket.on(
      "closeChat",
      ({ userId, otherUserId }) => {
        const room = `chat:${userId}:${otherUserId}`;

        socket.leave(room);

        console.log(
          `User ${userId} closed chat with ${otherUserId}`
        );
      }
    );


    // =========================
    // SEND MESSAGE
    // =========================

    socket.on(
      "sendMessage",
      async ({
        senderId,
        receiverId,
        text,
      }) => {
        try {
          if (!text?.trim()) {
            return;
          }


          // Save message

          const message =
            await createMessageService(
              senderId,
              receiverId,
              text
            );


          // Tell sender message was saved

          socket.emit(
            "messageSent",
            message
          );


          // Receiver's personal room

          const receiverRoom =
            `user:${receiverId}`;


          // Check if receiver is connected

          const activeConnections =
            await io
              .in(receiverRoom)
              .fetchSockets();


          // Receiver is NOT connected

          if (activeConnections.length === 0) {
            return;
          }


          // Receiver is connected

          // Check if receiver has this chat open

          const chatRoom =
            `chat:${receiverId}:${senderId}`;


          const chatConnections =
            await io
              .in(chatRoom)
              .fetchSockets();


          // =========================
          // RECEIVER HAS CHAT OPEN
          // =========================

          if (chatConnections.length > 0) {

            message.status = "seen";

            await message.save();


            // Send message to receiver

            io.to(receiverRoom).emit(
              "receiveMessage",
              message
            );


            // Tell sender message is seen

            socket.emit(
              "messageDelivered",
              {
                messageId: message._id,
                status: "seen",
              }
            );


            socket.emit(
              "messagesSeen",
              {
                seenBy: receiverId,
                messageId: message._id,
              }
            );

          }


          // =========================
          // RECEIVER CONNECTED
          // BUT CHAT NOT OPEN
          // =========================

          else {

            message.status = "delivered";

            await message.save();


            // Send message to receiver

            io.to(receiverRoom).emit(
              "receiveMessage",
              message
            );


            // Tell sender message is delivered

            socket.emit(
              "messageDelivered",
              {
                messageId: message._id,
                status: "delivered",
              }
            );

          }

        } catch (error) {

          console.log(
            "Send message error:",
            error.message
          );

        }
      }
    );


    // =========================
    // MARK MESSAGE AS SEEN
    // =========================

    socket.on(
      "markSeen",
      async ({
        receiverId,
        senderId,
      }) => {

        try {

          await markMessagesSeenService(
            receiverId,
            senderId
          );


          // Tell sender

          io.to(
            `user:${senderId}`
          ).emit(
            "messagesSeen",
            {
              seenBy: receiverId,
            }
          );

        } catch (error) {

          console.log(
            "Mark seen error:",
            error.message
          );

        }
      }
    );


    // =========================
    // DISCONNECT
    // =========================

    socket.on(
      "disconnect",
      () => {
        console.log(
          "Socket disconnected:",
          socket.id
        );
      }
    );

  });

  return io;
};

export default socketHelper;