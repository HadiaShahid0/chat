import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);

    process.exit(1);
  }
};

export default connectDB;
