import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["donor", "patient", "hospital", "bloodbank", "ngo", "admin"],
      default: "donor",
    },
    bloodGroup: { type: String, enum: BLOOD_GROUPS },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
    },
    isAvailable: { type: Boolean, default: true }, // donor availability toggle
    lastDonationDate: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    rewardPoints: { type: Number, default: 0 },
    totalDonations: { type: Number, default: 0 },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });
userSchema.index({ bloodGroup: 1, city: 1, isAvailable: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Basic donation-eligibility rule: 90 days since last donation
userSchema.methods.isEligibleToDonate = function () {
  if (!this.lastDonationDate) return true;
  const days = (Date.now() - this.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24);
  return days >= 90;
};

export const BLOOD_GROUP_LIST = BLOOD_GROUPS;
export default mongoose.model("User", userSchema);
