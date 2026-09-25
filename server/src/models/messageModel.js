import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const Message = sequelize.define(
  "Message",
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // User who sent the message
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // User who receives the message
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Text message
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
    },

    // Image path
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    // Message status
    status: {
      type: DataTypes.ENUM("sent", "delivered", "seen"),
      allowNull: false,
      defaultValue: "sent",
    },
  },
  {
    // MySQL table name
    tableName: "messages",

    // Automatically creates createdAt and updatedAt
    timestamps: true,

    // // Composite index
    indexes: [
      {
        name: "sender_receiver_id",
        fields: ["senderId", "receiverId"],
      },
    ],
  },
);

export default Message;
// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     sender: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     receiver: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     text: {
//       type: String,
//       trim: true,
//       default: "",
//     },

//     image: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["sent", "delivered", "seen"],
//       default: "sent",
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// messageSchema.index({
//   sender: 1,
//   receiver: 1,
//   createdAt: 1,
// });

// export default mongoose.model("Message", messageSchema);
