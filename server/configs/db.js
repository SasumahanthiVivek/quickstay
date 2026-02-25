import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.once("connected", () =>
      console.log("Database Connected")
    );

    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/quickstay";
    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
