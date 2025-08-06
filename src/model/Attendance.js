import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["present", "absent", "leave"], default: "present" },
  checkIn: { type: Date },
  checkOut: { type: Date },
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema);

