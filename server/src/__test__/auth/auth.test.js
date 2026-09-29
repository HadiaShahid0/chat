import { describe, it, expect, vi, beforeEach } from "vitest";

import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";

import {
  generateMfaToken,
  generateToken,
  generatePasswordResetToken,
} from "../../utils/jwt.js";
import { verifyCaptcha } from "../../services/captchaService.js";
import {
  registerService,
  loginService,
  verifyService,
  logoutService,
  verifyOtpService,
  forgotPasswordService,
  verifyResetOtpService,
  resetPasswordService,
} from "../../services/authServices.js";
import transporter from "../../utils/nodemailer.js";
import PendingUser from "../../models/pendingUsers.js";

vi.mock("../../models/userModel.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
  },
}));

vi.mock("../../models/pendingUsers.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    destroy: vi.fn(),
  },
}));

vi.mock("../../utils/nodemailer.js", () => ({
  default: {
    sendMail: vi.fn(),
  },
}));
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock("../../utils/jwt.js", () => ({
  generateToken: vi.fn(),
  generateMfaToken: vi.fn(),
  generatePasswordResetToken: vi.fn(),
}));

vi.mock("../../services/captchaService.js", () => ({
  verifyCaptcha: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  verifyCaptcha.mockResolvedValue(true);
});

describe("auth", () => {
  it("user can register successfully", async () => {
    User.findOne.mockResolvedValue(null);

    PendingUser.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    PendingUser.create.mockResolvedValue({
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
      otp: "12345",
    });

    transporter.sendMail.mockResolvedValue(true);

    const user = await registerService(
      "Test User",
      "test@gmail.com",
      "123456",
      "captcha-token",
    );

    expect(user).toEqual({ message: "OTP sent successfully." });

    expect(verifyCaptcha).toHaveBeenCalledWith("captcha-token");

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@gmail.com",
      },
    });

    expect(PendingUser.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@gmail.com",
      },
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

    expect(PendingUser.create).toHaveBeenCalled();

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.EMAIL,
        to: "test@gmail.com",
        subject: "OTP verification code",
      }),
    );
  });

  it("should fail when CAPTCHA verification fails", async () => {
    verifyCaptcha.mockRejectedValue(new Error("CAPTCHA verification failed."));

    await expect(
      registerService(
        "Test User",
        "test@gmail.com",
        "123456",
        "invalid-captcha",
      ),
    ).rejects.toThrow("CAPTCHA verification failed.");

    expect(User.findOne).not.toHaveBeenCalled();

    expect(PendingUser.create).not.toHaveBeenCalled();

    expect(transporter.sendMail).not.toHaveBeenCalled();
  });

  it("should remove existing pending registration before creating a new one", async () => {
    const existingPendingUser = {
      destroy: vi.fn(),
    };

    User.findOne.mockResolvedValue(null);

    PendingUser.findOne.mockResolvedValue(existingPendingUser);

    bcrypt.hash.mockResolvedValue("hashed-password");

    PendingUser.create.mockResolvedValue({});

    transporter.sendMail.mockResolvedValue(true);

    await registerService(
      "Test User",
      "test@gmail.com",
      "123456",
      "captcha-token",
    );

    expect(existingPendingUser.destroy).toHaveBeenCalled();

    expect(PendingUser.create).toHaveBeenCalled();
  });

  it("should hash password before creating pending user", async () => {
    User.findOne.mockResolvedValue(null);

    PendingUser.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    PendingUser.create.mockResolvedValue({});

    transporter.sendMail.mockResolvedValue(true);

    await registerService(
      "Test User",
      "test@gmail.com",
      "123456",
      "captcha-token",
    );

    expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);

    expect(PendingUser.create).toHaveBeenCalledWith(
      expect.objectContaining({
        password: "hashed-password",
      }),
    );
  });

  it("should remove pending user when OTP email fails", async () => {
    User.findOne.mockResolvedValue(null);

    PendingUser.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");

    PendingUser.create.mockResolvedValue({});

    transporter.sendMail.mockRejectedValue(new Error("Email sending failed"));

    PendingUser.destroy.mockResolvedValue(true);

    await expect(
      registerService("Test User", "test@gmail.com", "123456", "captcha-token"),
    ).rejects.toThrow("Invalid email or unable to send OTP.");

    expect(PendingUser.destroy).toHaveBeenCalledWith({
      where: {
        email: "test@gmail.com",
      },
    });
  });

  it("user can login successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
      mfaEnabled: false,
    };

    User.findOne.mockResolvedValue(user);

    bcrypt.compare.mockResolvedValue(true);

    generateToken.mockReturnValue("test-token");

    const result = await loginService("test@gmail.com", "123456");

    expect(result).toEqual({
      requiresMfa: false,
      user,
      token: "test-token",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@gmail.com",
      },
    });

    expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashed-password");

    expect(generateToken).toHaveBeenCalledWith(1);
  });

  it("user can be verified successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    };

    User.findByPk.mockResolvedValue(user);

    const verifyResult = await verifyService(1);

    expect(verifyResult).toEqual(user);

    expect(User.findByPk).toHaveBeenCalled(1);
  });

  it("login fails when email does not exists", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(loginService("wrong@gmail.com", "123456")).rejects.toThrow(
      "Invalid email or password",
    );

    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(generateToken).not.toHaveBeenCalled();
  });

  it("login fails when password does not match", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    };

    User.findOne.mockResolvedValue(user);

    bcrypt.compare.mockResolvedValue(false);

    await expect(loginService("test@gmail.com", "12346")).rejects.toThrow(
      "Invalid email or password",
    );
    expect(generateToken).not.toHaveBeenCalledWith(1);
  });

  it("should return MFA token when MFA is enabled", async () => {
    const user = {
      id: 1,
      email: "test@gmail.com",
      password: "hashed-password",
      mfaEnabled: true,
    };

    User.findOne.mockResolvedValue(user);

    bcrypt.compare.mockResolvedValue(true);

    generateMfaToken.mockReturnValue("mfa-token");

    const result = await loginService("test@gmail.com", "123456");

    expect(result).toEqual({
      requiresMfa: true,
      mfaToken: "mfa-token",
    });

    expect(generateMfaToken).toHaveBeenCalledWith(1);

    expect(generateToken).not.toHaveBeenCalled();
  });

  it("user can logout successfully", async () => {
    const logout = logoutService();
    expect(logout).toBe(true);
  });

  it("should send password reset OTP successfully", async () => {
    const user = {
      id: 1,
      email: "test@gmail.com",
      update: vi.fn(),
    };

    User.findOne.mockResolvedValue(user);

    transporter.sendMail.mockResolvedValue(true);

    const result = await forgotPasswordService("test@gmail.com");

    expect(result).toEqual({
      message: "Password reset OTP sent successfully.",
    });

    expect(User.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@gmail.com",
      },
    });

    expect(user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        resetPasswordOtp: expect.any(String),

        resetPasswordOtpExpiredAt: expect.any(Date),
      }),
    );

    expect(transporter.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: process.env.EMAIL,
        to: "test@gmail.com",
        subject: "Password Reset OTP",
      }),
    );
  });

  it("should fail when email does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(forgotPasswordService("wrong@gmail.com")).rejects.toThrow(
      "Email does not exist.",
    );

    expect(transporter.sendMail).not.toHaveBeenCalled();
  });

  it("should clear reset OTP when email sending fails", async () => {
    const user = {
      id: 1,
      email: "test@gmail.com",
      update: vi.fn(),
    };

    User.findOne.mockResolvedValue(user);

    transporter.sendMail.mockRejectedValue(new Error("Email failed"));

    await expect(forgotPasswordService("test@gmail.com")).rejects.toThrow(
      "Unable to send password reset email.",
    );

    expect(user.update).toHaveBeenCalledWith({
      resetPasswordOtp: null,
      resetPasswordOtpExpiredAt: null,
    });
  });

  it("should verify reset OTP successfully", async () => {
    const user = {
      id: 1,
      email: "test@gmail.com",
      resetPasswordOtp: "123456",
      resetPasswordOtpExpiredAt: new Date(Date.now() + 60000),
      update: vi.fn(),
    };

    User.findOne.mockResolvedValue(user);

    generatePasswordResetToken.mockReturnValue("reset-token");

    const result = await verifyResetOtpService("test@gmail.com", "123456");

    expect(result).toEqual({
      message: "OTP verified successfully.",
      resetToken: "reset-token",
    });

    expect(generatePasswordResetToken).toHaveBeenCalledWith(1);

    expect(user.update).toHaveBeenCalledWith({
      resetPasswordOtp: null,
      resetPasswordOtpExpiredAt: null,
    });
  });

  it("should fail when user does not exist", async () => {
    User.findOne.mockResolvedValue(null);

    await expect(
      verifyResetOtpService("wrong@gmail.com", "123456"),
    ).rejects.toThrow("Invalid or expired OTP.");

    expect(generatePasswordResetToken).not.toHaveBeenCalled();
  });

  it("should fail when reset OTP does not exist", async () => {
    const user = {
      id: 1,
      resetPasswordOtp: null,
    };

    User.findOne.mockResolvedValue(user);

    await expect(
      verifyResetOtpService("test@gmail.com", "123456"),
    ).rejects.toThrow("Invalid or expired OTP.");

    expect(generatePasswordResetToken).not.toHaveBeenCalled();
  });

  it("should fail when reset OTP has expired", async () => {
    const user = {
      id: 1,
      resetPasswordOtp: "123456",
      resetPasswordOtpExpiredAt: new Date(Date.now() - 60000),
      update: vi.fn(),
    };

    User.findOne.mockResolvedValue(user);

    await expect(
      verifyResetOtpService("test@gmail.com", "123456"),
    ).rejects.toThrow("OTP has expired.");

    expect(user.update).toHaveBeenCalledWith({
      resetPasswordOtp: null,
      resetPasswordOtpExpiredAt: null,
    });

    expect(generatePasswordResetToken).not.toHaveBeenCalled();
  });

  it("should fail when reset OTP is invalid", async () => {
    const user = {
      id: 1,
      resetPasswordOtp: "123456",
      resetPasswordOtpExpiredAt: new Date(Date.now() + 60000),
      update: vi.fn(),
    };

    User.findOne.mockResolvedValue(user);

    await expect(
      verifyResetOtpService("test@gmail.com", "999999"),
    ).rejects.toThrow("Invalid OTP.");

    expect(generatePasswordResetToken).not.toHaveBeenCalled();

    expect(user.update).not.toHaveBeenCalled();
  });
  it("should reset password successfully", async () => {
  
        const user = {
          id: 1,
          email: "test@gmail.com",
          password: "old-password",
          update: vi.fn(),
        };
  
        User.findByPk.mockResolvedValue(user);
  
        bcrypt.hash.mockResolvedValue(
          "new-hashed-password"
        );
  
        const result =
          await resetPasswordService(
            1,
            "new-password"
          );
  
        expect(result).toEqual({
          message:
            "Password reset successfully.",
        });
  
        expect(bcrypt.hash).toHaveBeenCalledWith(
          "new-password",
          10
        );
  
        expect(user.update).toHaveBeenCalledWith({
          password: "new-hashed-password",
        });
      });
  
  
      it("should fail when user does not exist", async () => {
  
        User.findByPk.mockResolvedValue(null);
  
        await expect(
          resetPasswordService(
            999,
            "new-password"
          )
        ).rejects.toThrow(
          "User not found."
        );
  
        expect(bcrypt.hash).not.toHaveBeenCalled();
      });
});
