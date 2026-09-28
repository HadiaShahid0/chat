import {
  registerService,
  loginService,
  verifyService,
  logoutService,
  verifyOtpService
} from "../../services/authServices.js";
import {verifyMfaLoginService} from "../../services/mfaServices.js"
// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const { user, token } = await registerService(name, email, password);

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