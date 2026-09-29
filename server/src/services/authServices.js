import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import PendingUser from "../models/pendingUsers.js";
import { generateToken, generateMfaToken,generatePasswordResetToken } from "../utils/jwt.js";
import transporter from "../utils/nodemailer.js";
import { verifyCaptcha } from "./captchaService.js";
import crypto from "crypto";
export const registerService = async (name, email, password,captchaToken) => {
  await verifyCaptcha(captchaToken)
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


export const forgotPasswordService = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new Error("Email does not exist.");
  }
  const resetPasswordOtp = crypto
    .randomInt(100000, 1000000)
    .toString();

  const resetPasswordOtpExpiredAt = new Date(
    Date.now() + 3 * 60 * 1000
  );

  await user.update({
    resetPasswordOtp,
    resetPasswordOtpExpiredAt,
  });

  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP is ${resetPasswordOtp}. This OTP will expire in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOption);

    return {
      message: "Password reset OTP sent successfully.",
    };
  } catch (error) {
    console.log("Password reset email error:", error);

    await user.update({
      resetPasswordOtp: null,
      resetPasswordOtpExpiredAt: null,
    });

    throw new Error("Unable to send password reset email.");
  }
};

export const verifyResetOtpService = async (email, otp) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user || !user.resetPasswordOtp) {
    throw new Error("Invalid or expired OTP.");
  }

  if (
    !user.resetPasswordOtpExpiredAt ||
    new Date() > new Date(user.resetPasswordOtpExpiredAt)
  ) {
    await user.update({
      resetPasswordOtp: null,
      resetPasswordOtpExpiredAt: null,
    });

    throw new Error("OTP has expired.");
  }

  if (user.resetPasswordOtp !== otp.toString()) {
    throw new Error("Invalid OTP.");
  }

  const resetToken = generatePasswordResetToken(user.id);

  // OTP cannot be reused
  await user.update({
    resetPasswordOtp: null,
    resetPasswordOtpExpiredAt: null,
  });

  return {
    message: "OTP verified successfully.",
    resetToken,
  };
};

export const resetPasswordService = async (
  userId,
  newPassword
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
  });

  return {
    message: "Password reset successfully.",
  };
};