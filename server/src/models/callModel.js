import mongoose from "mongoose";

const callSchema = new Schema(
  {
    offerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    callDuration: {
      type: String,
      date: Date.now(),
    },
  },
  {
    timeStamps: true,
  },
);
