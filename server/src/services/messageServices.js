import Message from "../models/messageModel.js";

// Create a message
export const createMessageService = async (senderId, receiverId, text) => {
  // Create the message in the database with the sender ID, receiver ID, and trimmed text
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    text: text.trim(),
  });

  // Return the created message
  return message;
};

// Get messages between two users
export const getMessagesService = async (userId, otherUserId) => {
  // Get messages from the database
  const messages = await Message.find({
    // Find messages where either user is the sender and the other is the receiver
    $or: [
      {
        sender: userId,
        receiver: otherUserId,
      },
      {
        sender: otherUserId,
        receiver: userId,
      },
    ],

    // Sort messages by creation time, from oldest to newest
  }).sort({ createdAt: 1 });

  // Return the messages
  return messages;
};

// Mark messages as delivered
export const markMessagesDeliveredService = async (receiverId) => {
  //find all messages with sent status
  const messages = await Message.find({
    receiver: receiverId,
    status: "sent",
  });

  console.log("message", messages);

  //Update the status in db
  Message.updateMany(
    {
      receiver: receiverId,
      status: "sent",
    },
    {
      $set: {
        status: "delivered",
      },
    },
  );

  //Return find messages and use it in socket.io
  return messages.map((message) => ({
    ...message.toObject(),
    status: "delivered",
  }));
};

// Mark messages as seen
export const markMessagesSeenService = async (receiverId, senderId) => {
  //Wait for the db update to complete
  //if we remove the await the message is seen for a meanwhile but when the chat is closed and opened it again show the delivered instead of seen
  await Message.updateMany(
    {
      sender: senderId,
      receiver: receiverId,
      status: {
        $ne: "seen",
      },
    },
    {
      $set: {
        status: "seen",
      },
    },
  );
};
