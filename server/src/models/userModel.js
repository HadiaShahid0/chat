import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
const User = sequelize.define(
  "User",
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // User's name
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // User's email
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    // Hashed password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Profile image path
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    // otpCode: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // otpExpiredAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
    // isVerified: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },

    
    // User's online/offline status
    // status: {
    //   type: DataTypes.ENUM("online", "offline"),
    //   allowNull: false,
    //   defaultValue: "offline",
    // },

    // // Last time the user was active
    // lastSeen: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    //   defaultValue: null,
    // },
  },

  {
    // MySQL table name
    tableName: "users",

    // Automatically creates:
    // createdAt
    // updatedAt
    timestamps: true,
  },
);
export default User;
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//       minlength: [3, "Name must be at least 3 characters"],
//       maxlength: [50, "Name cannot exceed 50 characters"],
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
//     },

//     password: {
//       type: String,
//       required: [true, "Password is required"],
//       minlength: [8, "Password must be at least 8 characters"],
//     },
//     socketId: {
//       type: String,
//       default: null,
//     },
//     profileImage: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["online", "offline"],
//       default: "offline",
//     },

//     lastSeen: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   },
// );

// const User = mongoose.model("User", userSchema);

// export default User;
