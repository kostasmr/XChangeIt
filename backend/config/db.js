import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        });
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

