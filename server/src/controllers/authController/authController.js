import {
  registerService,
  loginService,
  verifyService,
  logoutService,
  verifyOtpService,
  forgotPasswordService,
  verifyResetOtpService,
resetPasswordService
} from "../../services/authServices.js";
import jwt from "jsonwebtoken";

import {verifyMfaLoginService} from "../../services/mfaServices.js"
// Register
export const register = async (req, res) => {
  try {
    const { name, email, password,captchaToken } = req.body;

    const { user, token } = await registerService(name, email, password,captchaToken);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await loginService(email, password);

    // MFA is required
    if (result.requiresMfa) {
      return res.status(200).json({
        success: true,
        requiresMfa: true,
        mfaToken: result.mfaToken,
      });
    }

    // Normal login
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      requiresMfa: false,
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify User
export const verify = async (req, res) => {
  try {
    const user = await verifyService(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    await logoutService();

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const verifyMfaLogin = async (req, res) => {
  try {
    const { mfaToken, token } = req.body;

    const result = await verifyMfaLoginService(
      mfaToken,
      token,
    );

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: result.user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    const result = await forgotPasswordService(email);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required.",
      });
    }

    const result = await verifyResetOtpService(email, otp);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    const decoded = jwt.verify(
      resetToken,
      process.env.JWT_SECRET_KEY
    );

    if (decoded.type !== "password-reset") {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const result = await resetPasswordService(
      decoded.userId,
      newPassword
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Reset token has expired."
          : error.message,
    });
  }
};