import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";
import User from "../models/userModel.js";

export const setupMfaService = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.mfaEnabled) {
    throw new Error("MFA is already enabled.");
  }

  const secret = generateSecret();

  const otpauthUrl = generateURI({
    issuer: "Chat App",
    label: user.email,
    secret,
  });

  const qrCode = await QRCode.toDataURL(otpauthUrl);

  await user.update({
    mfaSecret: secret,
  });

  return { qrCode };
};

export const verifyMfaSetupService = async (userId, token) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.mfaSecret) {
    throw new Error("MFA setup has not been started.");
  }

  if (user.mfaEnabled) {
    throw new Error("MFA is already enabled.");
  }

  const result = await verify({
    token,
    secret: user.mfaSecret,
  });

  if (!result.valid) {
    throw new Error("Invalid authenticator code.");
  }

  await user.update({
    mfaEnabled: true,
  });

  return {
    message: "MFA enabled successfully.",
  };
};

export const disableMfaService = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  await user.update({
    mfaEnabled: false,
    mfaSecret: null,
  });

  return {
    message: "MFA disabled successfully.",
  };
};

export const verifyMfaLoginService = async (mfaToken, token) => {
  let decoded;

  try {
    decoded = jwt.verify(mfaToken, process.env.JWT_SECRET_KEY);
  } catch (error) {
    console.log("MFA JWT ERROR:", error);
    console.log("MFA JWT ERROR:", error.name);
    console.log("MFA JWT MESSAGE:", error.message);
  }

  console.log("DECODED MFA TOKEN:", decoded);

  if (decoded.type !== "mfa") {
    throw new Error("Invalid MFA session.");
  }

  const user = await User.findByPk(decoded.userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.mfaEnabled || !user.mfaSecret) {
    throw new Error("MFA is not enabled.");
  }

  const result = await verify({
    token,
    secret: user.mfaSecret,
  });

  if (!result.valid) {
    throw new Error("Invalid authenticator code.");
  }

  const jwtToken = generateToken(user.id);

  return {
    user,
    token: jwtToken,
  };
};
