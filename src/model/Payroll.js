import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payPeriod: {
    type: Date,
    required: true
  },
  
  basicSalary: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Payroll || mongoose.model("Payroll", payrollSchema);