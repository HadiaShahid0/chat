import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const PendingUser = sequelize.define(
  "PendingUser",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    otpExpiredAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "pendingUsers",
    timestamps: true,
  },
);

export default PendingUser;