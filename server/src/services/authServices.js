import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import PendingUser from "../models/pendingUsers.js";
import { generateToken, generateMfaToken } from "../utils/jwt.js";
import transporter from "../utils/nodemailer.js";

export const registerService = async (name, email, password) => {
  const existingUser = await User.findOne({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  const existingPendingUser = await PendingUser.findOne({
    where: { email },
  });

  if (existingPendingUser) {
    await existingPendingUser.destroy();
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const otp = Math.floor(10000 + Math.random() * 90000);

  const otpExpiredAt = new Date(Date.now() + 2 * 60 * 1000);

  await PendingUser.create({
    name,
    email,
    password: hashedPassword,
    otp: otp.toString(),
    otpExpiredAt,
  });

  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "OTP verification code",
    text: `Your OTP is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOption);

    return {
      message: "OTP sent successfully.",
    };
  } catch (error) {
    console.log("Email sending error:", error);

    await PendingUser.destroy({
      where: { email },
    });

    throw new Error("Invalid email or unable to send OTP.");
  }
};
// Login User
export const loginService = async (email, password) => {
  const user = await User.findOne({
    where: { email },
  });

  console.log("USER FROM DATABASE:", user);

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  console.log("USER ID:", user.id);
  console.log("MFA ENABLED:", user.mfaEnabled);

  if (user.mfaEnabled) {
    console.log("Before generateMfaToken");
    console.log("user.id =", user.id);
    console.log("generateMfaToken =", generateMfaToken);

    const mfaToken = generateMfaToken(user.id);

    console.log("MFA TOKEN CREATED");

    return {
      requiresMfa: true,
      mfaToken,
    };
  }

  const token = generateToken(user.id);

  return {
    requiresMfa: false,
    user,
    token,
  };
};

// Verify User
export const verifyService = async (userId) => {
  // Find user by MySQL primary key
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// Logout
export const logoutService = () => {
  return true;
};

export const verifyOtpService = async (email, otp) => {
  const pendingUser = await PendingUser.findOne({
    where: {
      email,
    },
  });

  if (!pendingUser) {
    throw new Error("Registration not found.");
  }

  if (new Date() > new Date(pendingUser.otpExpiredAt)) {
    await pendingUser.destroy();

    throw new Error("OTP has expired.");
  }

  if (pendingUser.otp !== otp.toString()) {
    throw new Error("Invalid OTP.");
  }

  // Create actual user only after OTP verification
  const user = await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
  });

  // Remove temporary registration
  await pendingUser.destroy();

  return {
    message: "Email verified and account created successfully.",
    user,
  };
};
