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

        // Tell senders that their messages are delivered
        for (const message of pendingMessages) {
          io.to(`user:${message.sender}`).emit("messageStatusUpdate", {
            messageId: message._id,
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

        // Show message to sender
        socket.emit("messageSent", message);

        const receiverRoom = `user:${receiverId}`;

        // Check if receiver is online and chat is opened
        const receiverSockets = await io.in(receiverRoom).fetchSockets();

        //means user is offline
        if (receiverSockets.length === 0) {
          return;
        }

        // Check if receiver has this chat open, create a variable chatRoom
        // where we put the receiverId & senderId to check whether the chat is opened or not
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

        // Update sender status
        socket.emit("messageStatusUpdate", {
          messageId: message._id,
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
        // Don't use await here because we only call the service to save the data to the database.
        markMessagesSeenService(receiverId, senderId);

        //update the message status
        io.to(`user:${senderId}`).emit("messageStatusUpdate", {
          senderId,
          receiverId,
          status: "seen",
        });
      } catch (error) {
        console.log("Mark seen error:", error.message);
      }
    });

    // Caller = User A
    // The user who starts the audio call.

    // Callee = User B
    // The user who receives the audio call.

    // Caller starts the call.
    // This event runs when User A sends "callUser" from the frontend.
    socket.on("callUser", ({ callerId, calleeId }) => {
      console.log("CALL USER");
      console.log("callerId:", callerId);
      console.log("calleeId:", calleeId);

      // Send the incoming call notification to User B.
      // "user:calleeId" is the room where User B's socket is connected.
      io.to(`user:${calleeId}`).emit("incomingCall", {
        // Send the caller's ID to User B.
        // User B needs this ID when accepting, rejecting, or ending the call.
        callerId,
        calleeId,
      });
    });

    // Receiver accepts the call.
    // This event runs when User B clicks the Accept button.
    socket.on("acceptCall", ({ callerId, calleeId }) => {
      console.log("CALL ACCEPTED");
      console.log("callerId:", callerId);
      console.log("calleeId:", calleeId);

      // Send the "callAccepted" event to User A.
      // User A needs to know that User B accepted the call.
      io.to(`user:${callerId}`).emit("callAccepted", {
        // Send the caller ID to User A.
        callerId,

        // Send the callee ID to User A.
        // This is needed later for WebRTC signaling.
        calleeId,
      });
    });

    // Receiver rejects the call.
    // This event runs when User B clicks the Reject button.
    socket.on("rejectCall", ({ callerId, calleeId }) => {
      console.log("CALL REJECTED");
      console.log("callerId:", callerId);
      console.log("calleeId:", calleeId);

      // Send the "callRejected" event to User A.
      // User A can then close the calling UI.
      io.to(`user:${callerId}`).emit("callRejected", {
        // Send the callee ID to User A.
        calleeId,

        // Send the caller ID to User A.
        callerId,
      });
    });

    // End the call.
    // This event runs when either User A or User B clicks the End Call button.
    socket.on("endCall", ({ callerId, calleeId }) => {
      console.log("CALL ENDED");
      console.log("callerId:", callerId);
      console.log("calleeId:", calleeId);

      // Send "callEnd" to the caller.
      // The caller needs to close their call UI and WebRTC connection.
      io.to(`user:${callerId}`).emit("callEnd", {
        // Send the caller ID with the event.
        callerId,

        // Send the callee ID with the event.
        calleeId,
      });

      // Send "callEnd" to the callee.
      // The callee also needs to close their call UI and WebRTC connection.
      io.to(`user:${calleeId}`).emit("callEnd", {
        // Send the caller ID with the event.
        callerId,

        // Send the callee ID with the event.
        calleeId,
      });
    });

    // Applying the Audio Call Socket.
    // The following events are used for WebRTC signaling.
    // Socket.IO does not carry the actual audio.
    // It only helps both users exchange WebRTC information.

    // SEND OFFER
    // The caller creates an offer and sends it to the callee.
    socket.on("offer", ({ senderId, receiverId, offer }) => {
      console.log("WEBRTC OFFER");
      console.log("senderId:", senderId);
      console.log("receiverId:", receiverId);

      // Send the offer to the receiver's user room.
      // The server does not create or modify the offer.
      // It only forwards it to the correct user.
      io.to(`user:${receiverId}`).emit("offer", {
        // Tell the receiver who created the offer.
        senderId,

        // Send the WebRTC offer to the receiver.
        offer,
      });
    });

    // SEND ANSWER
    // The callee creates an answer after receiving the offer.
    socket.on("answer", ({ senderId, receiverId, answer }) => {
      console.log("WEBRTC ANSWER");
      console.log("senderId:", senderId);
      console.log("receiverId:", receiverId);

      // Send the answer to the receiver's user room.
      // The server only forwards the answer.
      io.to(`user:${receiverId}`).emit("answer", {
        // Tell the receiver who created the answer.
        senderId,

        // Send the WebRTC answer to the receiver.
        answer,
      });
    });

    // SEND ICE CANDIDATE
    // Both users can send ICE candidates during the WebRTC connection.
    socket.on("ice-candidate", ({ senderId, receiverId, candidate }) => {
      console.log("WEBRTC ICE CANDIDATE");

      // Send the ICE candidate to the other user's room.
      // The server only forwards the candidate.
      io.to(`user:${receiverId}`).emit("ice-candidate", {
        // Tell the receiver who sent the candidate.
        senderId,

        // Send the ICE candidate to the other user.
        candidate,
      });
    });
  });

  return io;
};

export default socketHelper;
