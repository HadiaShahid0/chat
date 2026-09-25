
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);

export default sequelize;
// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     console.log("MONGO_URI:", process.env.MONGO_URI);
//     console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);

//     process.exit(1);
//   }
// };

// export default connectDB;
