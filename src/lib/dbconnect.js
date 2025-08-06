import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log("ENV MONGO_URI:", process.env.MONGO_URI);

if (!MONGO_URI) throw new Error("MONGO_URI not defined");

export async function connectDB()
{
    try
    {
        if (mongoose.connection.readyState >= 1)
        {
            return;
        }
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error)
    {
        console.error(" MongoDB connection error:", error);
    }
}