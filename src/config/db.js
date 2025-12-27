import mongoose from "mongoose";

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
  } catch (error) {
    console.error("Error connecting to the db : ", error);
  }
};

export default connectDb;
