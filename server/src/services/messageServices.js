import Message from "../models/messageModal.js";

// Create message
export const createMessageService = async (senderId, receiverId, text) => {
  const message = await Message.create({
    sender: senderId,
    receiver: receiverId,
    text: text.trim(),
  });

  return message;
};

// Get messages between two users
export const getMessagesService = async (userId, otherUserId) => {
  const messages = await Message.find({
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
  }).sort({ createdAt: 1 });

  return messages;
};

// Mark messages as delivered
export const markMessagesDeliveredService = async (receiverId) => {
  const messages = await Message.find({
    receiver: receiverId,
    status: "sent",
  });

  await Message.updateMany(
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

  return messages.map((message) => ({
    ...message.toObject(),
    status: "delivered",
  }));
};

// Mark messages as seen
export const markMessagesSeenService = async (receiverId, senderId) => {
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
