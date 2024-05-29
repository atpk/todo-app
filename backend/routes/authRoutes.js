const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const EmailVerification = require("../models/emailVerification");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { sendOtpEmail } = require("../services/emailService");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, recaptchaToken } = req.body;
    console.log("register req for: ", email);

    // Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otpExpiration = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const emailVerification = new EmailVerification({
      email,
      otp,
      otpExpiration,
    });
    await emailVerification.save();
    await sendOtpEmail(email, otp);

    console.log("otp sent to email: ", email);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.log("Error sending OPT");
    res.status(400).json({ message: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const emailVerification = await EmailVerification.findOne({ email });

    if (
      !emailVerification ||
      emailVerification.otp !== otp ||
      emailVerification.otpExpiration < new Date()
    ) {
      console.log("Invalid or expired OPT");
      await EmailVerification.deleteMany({ email });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await EmailVerification.deleteMany({ email });

    const user = new User({ email, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email, recaptchaToken } = req.body;
    console.log("forgot password of: ", email);

    // Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const otpExpiration = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    const emailVerification = new EmailVerification({
      email,
      otp,
      otpExpiration,
    });
    await emailVerification.save();
    await sendOtpEmail(email, otp);

    console.log("OTP sent to email: ", email);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const emailVerification = await EmailVerification.findOne({ email });

    if (
      !emailVerification ||
      emailVerification.otp !== otp ||
      emailVerification.otpExpiration < new Date()
    ) {
      console.log("Invalid or expired OPT");
      await EmailVerification.deleteMany({ email });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    await EmailVerification.deleteMany({ email });

    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    const response = await axios.post(verificationUrl);
    if (!response.data.success) {
      return res.status(400).json({ message: "reCAPTCHA verification failed" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
