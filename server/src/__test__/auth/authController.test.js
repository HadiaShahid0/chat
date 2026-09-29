import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  registerService,
  loginService,
  verifyService,
  logoutService,
  forgotPasswordService,
  verifyResetOtpService,
  resetPasswordService,
} from "../../services/authServices";
import jwt from "jsonwebtoken";

import {
  register,
  login,
  verify,
  logout,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../../controllers/authController/authController";

vi.mock("../../services/authServices.js", () => ({
  registerService: vi.fn(),
  loginService: vi.fn(),
  verifyService: vi.fn(),
  logoutService: vi.fn(),
  forgotPasswordService: vi.fn(),
  verifyResetOtpService: vi.fn(),
  resetPasswordService: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));
describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("register a user successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    };
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      },
    };

    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    registerService.mockResolvedValue({
      user,
      token: "test-token",
    });

    await register(req, res);

    expect(registerService).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalled({
      success: true,
      message: "Registration successful",
      user,
    });
  });

  it("returns error when registeration failed", async () => {
    const req = {
      body: {
        name: "Test User",
        email: "test@example.com",
        password: "123456",
      },
    };

    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    registerService.mockRejectedValue(new Error("Email already exists"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email already exists",
    });
  });

  it("login a user successfully", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "123456",
      },
    };

    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    loginService.mockResolvedValue({
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
      token: "login-token",
    });

    await login(req, res);

    expect(loginService).toHaveBeenCalled("test@example.com", "123456");
    expect(res.cookie).toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled({
      success: true,
      message: "Login successful",
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    });
  });

  it("returns error when login failed", async () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "123456",
      },
    };

    const res = {
      cookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    loginService.mockRejectedValue(new Error("Invalid email or password"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalled({
      success: false,
      message: "Invalid email or password",
    });
  });

  it("verifies a logged-in user successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    verifyService.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
    });

    await verify(req, res);

    expect(verifyService).toHaveBeenCalled(1);

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled({
      success: true,
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
    });
  });

  it("returns error when verify user failed", async () => {
    const req = {
      user: {
        id: 1,
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    verifyService.mockRejectedValue(new Error("User not found"));

    await verify(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalled({
      success: false,
      message: "User not found",
    });
  });

  it("logout a user successfully", async () => {
    const req = {};

    const res = {
      clearCookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await logout(req, res);

    expect(logoutService).toHaveBeenCalled();
    expect(res.clearCookie).toHaveBeenCalledWith("token");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalled({
      success: true,
      message: "logout successful",
    });
  });

  it("returns error when logout failed", async () => {
    const req = {};

    const res = {
      clearCookie: vi.fn(),
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    logoutService.mockRejectedValue(new Error("logout failed."));

    await logout(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalled({
      success: false,
      message: "logout failed.",
    });
  });

  // ---------------- FORGOT PASSWORD ----------------

  it("sends password reset OTP successfully", async () => {
    const req = {
      body: {
        email: "test@example.com",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    forgotPasswordService.mockResolvedValue({
      message: "Password reset OTP sent successfully.",
    });

    await forgotPassword(req, res);

    expect(forgotPasswordService).toHaveBeenCalledWith("test@example.com");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Password reset OTP sent successfully.",
    });
  });

  it("returns error when email is missing for forgot password", async () => {
    const req = {
      body: {},
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await forgotPassword(req, res);

    expect(forgotPasswordService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email is required.",
    });
  });

  it("returns error when forgot password service fails", async () => {
    const req = {
      body: {
        email: "test@example.com",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    forgotPasswordService.mockRejectedValue(new Error("Email does not exist."));

    await forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email does not exist.",
    });
  });

  // ---------------- VERIFY RESET OTP ----------------

  it("verifies password reset OTP successfully", async () => {
    const req = {
      body: {
        email: "test@example.com",
        otp: "123456",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    verifyResetOtpService.mockResolvedValue({
      message: "OTP verified successfully.",
      resetToken: "reset-token",
    });

    await verifyResetOtp(req, res);

    expect(verifyResetOtpService).toHaveBeenCalledWith(
      "test@example.com",
      "123456",
    );

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "OTP verified successfully.",
      resetToken: "reset-token",
    });
  });

  it("returns error when email or OTP is missing", async () => {
    const req = {
      body: {
        email: "test@example.com",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await verifyResetOtp(req, res);

    expect(verifyResetOtpService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Email and OTP are required.",
    });
  });

  it("returns error when reset OTP verification fails", async () => {
    const req = {
      body: {
        email: "test@example.com",
        otp: "123456",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    verifyResetOtpService.mockRejectedValue(new Error("Invalid OTP."));

    await verifyResetOtp(req, res);

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid OTP.",
    });
  });

  // ---------------- RESET PASSWORD ----------------

  it("resets password successfully", async () => {
    const req = {
      body: {
        resetToken: "valid-reset-token",
        newPassword: "newPassword123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    jwt.verify.mockReturnValue({
      userId: 1,
      type: "password-reset",
    });

    resetPasswordService.mockResolvedValue({
      message: "Password reset successfully.",
    });

    await resetPassword(req, res);

    expect(jwt.verify).toHaveBeenCalledWith(
      "valid-reset-token",
      process.env.JWT_SECRET_KEY,
    );

    expect(resetPasswordService).toHaveBeenCalledWith(1, "newPassword123");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Password reset successfully.",
    });
  });

  it("returns error when reset token or password is missing", async () => {
    const req = {
      body: {
        resetToken: "valid-reset-token",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await resetPassword(req, res);

    expect(jwt.verify).not.toHaveBeenCalled();

    expect(resetPasswordService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Reset token and new password are required.",
    });
  });

  it("returns error when reset token type is invalid", async () => {
    const req = {
      body: {
        resetToken: "invalid-type-token",
        newPassword: "newPassword123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    jwt.verify.mockReturnValue({
      userId: 1,
      type: "mfa",
    });

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid reset token.",
    });

    expect(resetPasswordService).not.toHaveBeenCalled();
  });

  it("returns error when reset token is expired", async () => {
    const req = {
      body: {
        resetToken: "expired-token",
        newPassword: "newPassword123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const error = new Error("jwt expired");
    error.name = "TokenExpiredError";

    jwt.verify.mockImplementation(() => {
      throw error;
    });

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Reset token has expired.",
    });

    expect(resetPasswordService).not.toHaveBeenCalled();
  });

  it("returns error when reset token is invalid", async () => {
    const req = {
      body: {
        resetToken: "invalid-token",
        newPassword: "newPassword123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token.");
    });

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid token.",
    });

    expect(resetPasswordService).not.toHaveBeenCalled();
  });

  it("returns error when password reset service fails", async () => {
    const req = {
      body: {
        resetToken: "valid-reset-token",
        newPassword: "newPassword123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    jwt.verify.mockReturnValue({
      userId: 1,
      type: "password-reset",
    });

    resetPasswordService.mockRejectedValue(new Error("User not found."));

    await resetPassword(req, res);

    expect(resetPasswordService).toHaveBeenCalledWith(1, "newPassword123");

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found.",
    });
  });
});
