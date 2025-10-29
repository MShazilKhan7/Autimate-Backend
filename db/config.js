import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_CONNECTION);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ MONGODB connection error:", error);
    process.exit(1);
  }
};
