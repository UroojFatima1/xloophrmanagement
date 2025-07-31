import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user" },

        // Optional fields for employees only
        position: { type: String },
        salary: { type: Number },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);