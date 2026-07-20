import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    unitsRequired: { type: Number, required: true, min: 1 },
    hospitalName: { type: String, required: true, trim: true },
    doctorName: { type: String, trim: true },
    urgency: { type: String, enum: ["critical", "high", "normal"], default: "normal" },
    city: { type: String, required: true, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    contactPhone: { type: String, required: true },
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ["open", "matching", "fulfilled", "cancelled", "expired"],
      default: "open",
    },
    searchRadiusKm: { type: Number, default: 10 },
    matchedDonors: [
      {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["notified", "accepted", "rejected", "completed"], default: "notified" },
        notifiedAt: { type: Date, default: Date.now },
      },
    ],
    statusTimeline: [
      {
        status: String,
        note: String,
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

bloodRequestSchema.index({ location: "2dsphere" });
bloodRequestSchema.index({ bloodGroup: 1, status: 1, city: 1 });

export default mongoose.model("BloodRequest", bloodRequestSchema);
