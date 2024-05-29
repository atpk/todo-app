const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const emailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiration: { type: Date },
});

// emailVerificationSchema.pre("save", async function (next) {
//   if (this.isModified("password") || this.isNew) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// emailVerificationSchema.methods.comparePassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema
);

module.exports = EmailVerification;
