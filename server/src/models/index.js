import User from "./userModel.js";
import Message from "./messageModel.js";

// User sends many messages
User.hasMany(Message, {
  foreignKey: "senderId",
  as: "sentMessages",
});

// User receives many messages
User.hasMany(Message, {
  foreignKey: "receiverId",
  as: "receivedMessages",
});

// Message belongs to the sender
Message.belongsTo(User, {
  foreignKey: "senderId",
  as: "sender",
});

// Message belongs to the receiver
Message.belongsTo(User, {
  foreignKey: "receiverId",
  as: "receiver",
});

export { User, Message };
