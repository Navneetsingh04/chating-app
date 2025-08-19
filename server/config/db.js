import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected successfully`);
  } catch (error) {
    console.log("Error in connecting mongoDb",error);
    process.exit(1);
  }
};
