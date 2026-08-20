import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = "mongodb://vira:vira@127.0.0.1:27018/ecommerce?authSource=admin";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully.");
  } catch (err: any) {
    console.error("Failed to connect to MongoDB:", err.message || err);
  }
};