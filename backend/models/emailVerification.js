const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: false },
  otp: { type: String },
  otpExpiration: { type: Date },
});

emailVerificationSchema.pre("save", async function (next) {
  if (this.isModified("otp") || this.isNew) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
  next();
});

emailVerificationSchema.methods.compareOtp = async function (otp) {
  return bcrypt.compare(otp, this.otp);
};

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerification;
