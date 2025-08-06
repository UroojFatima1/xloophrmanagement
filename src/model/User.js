import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name: { type: String, require: true },

    email: { type: String, unique: true, require: true },

    password: String,

    role: { type: String, enum: ["admin", "user"], default: "user" },

    salary: { type: Number, require: true },

    position: { type: String, require: true },

}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);