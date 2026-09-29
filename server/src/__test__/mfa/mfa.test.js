import { describe, it, expect, vi, beforeEach } from "vitest";

import User from "../../models/userModel.js";

import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt.js";

import {
  setupMfaService,
  verifyMfaSetupService,
  disableMfaService,
  verifyMfaLoginService,
} from "../../services/mfaServices.js";

vi.mock("../../models/userModel.js", () => ({
  default: {
    findByPk: vi.fn(),
  },
}));

vi.mock("otplib", () => ({
  generateSecret: vi.fn(),
  generateURI: vi.fn(),
  verify: vi.fn(),
}));

vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn(),
  },
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    verify: vi.fn(),
  },
}));

vi.mock("../../utils/jwt.js", () => ({
  generateToken: vi.fn(),
}));

describe("MFA Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setupMfa Service", () => {
    it("should setup MFA successfully", async () => {
      const user = {
        id: 1,
        email: "test@gmail.com",
        mfaEnabled: false,
        update: vi.fn(),
      };

      User.findByPk.mockResolvedValue(user);

      generateSecret.mockReturnValue("SECRET123");

      generateURI.mockReturnValue("otpauth://totp/Chat%20App:test@gmail.com");

      QRCode.toDataURL.mockResolvedValue("data:image/png;base64,test-qrcode");

      const result = await setupMfaService(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);

      expect(generateSecret).toHaveBeenCalled();

      expect(generateURI).toHaveBeenCalledWith({
        issuer: "Chat App",
        label: "test@gmail.com",
        secret: "SECRET123",
      });

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        "otpauth://totp/Chat%20App:test@gmail.com",
      );

      expect(user.update).toHaveBeenCalledWith({
        mfaSecret: "SECRET123",
      });

      expect(result).toEqual({
        qrCode: "data:image/png;base64,test-qrcode",
      });
    });

    it("should fail when user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(setupMfaService(999)).rejects.toThrow("User not found.");

      expect(User.findByPk).toHaveBeenCalledWith(999);

      expect(generateSecret).not.toHaveBeenCalled();

      expect(QRCode.toDataURL).not.toHaveBeenCalled();
    });

    it("should fail when MFA is already enabled", async () => {
      const user = {
        id: 1,
        email: "test@gmail.com",
        mfaEnabled: true,
        update: vi.fn(),
      };

      User.findByPk.mockResolvedValue(user);

      await expect(setupMfaService(1)).rejects.toThrow(
        "MFA is already enabled.",
      );

      expect(generateSecret).not.toHaveBeenCalled();

      expect(QRCode.toDataURL).not.toHaveBeenCalled();

      expect(user.update).not.toHaveBeenCalled();
    });
  });

  describe("disableMfaService", () => {
    it("should disable MFA successfully", async () => {
      const user = {
        id: 1,
        mfaEnabled: true,
        mfaSecret: "SECRET123",
        update: vi.fn(),
      };

      User.findByPk.mockResolvedValue(user);

      const result = await disableMfaService(1);

      expect(User.findByPk).toHaveBeenCalledWith(1);

      expect(user.update).toHaveBeenCalledWith({
        mfaEnabled: false,
        mfaSecret: null,
      });

      expect(result).toEqual({
        message: "MFA disabled successfully.",
      });
    });

    it("should fail when user does not exist", async () => {
      User.findByPk.mockResolvedValue(null);

      await expect(disableMfaService(999)).rejects.toThrow("User not found.");
    });
  });

  describe("verifyMfaLoginService", () => {
    it("should login successfully after valid MFA code", async () => {
      const user = {
        id: 1,
        email: "test@gmail.com",
        mfaEnabled: true,
        mfaSecret: "SECRET123",
      };

      jwt.verify.mockReturnValue({
        userId: 1,
        type: "mfa",
      });

      User.findByPk.mockResolvedValue(user);

      verify.mockResolvedValue({
        valid: true,
      });

      generateToken.mockReturnValue("final-jwt-token");

      const result = await verifyMfaLoginService("mfa-token", "123456");

      expect(jwt.verify).toHaveBeenCalledWith(
        "mfa-token",
        process.env.JWT_SECRET_KEY,
      );

      expect(User.findByPk).toHaveBeenCalledWith(1);

      expect(verify).toHaveBeenCalledWith({
        token: "123456",
        secret: "SECRET123",
      });

      expect(generateToken).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        user,
        token: "final-jwt-token",
      });
    });

    it("should fail when MFA token has invalid type", async () => {
      jwt.verify.mockReturnValue({
        userId: 1,
        type: "wrong-type",
      });

      await expect(
        verifyMfaLoginService("invalid-mfa-token", "123456"),
      ).rejects.toThrow("Invalid MFA session.");

      expect(User.findByPk).not.toHaveBeenCalled();

      expect(verify).not.toHaveBeenCalled();
    });

    it("should fail when user does not exist", async () => {
      jwt.verify.mockReturnValue({
        userId: 999,
        type: "mfa",
      });

      User.findByPk.mockResolvedValue(null);

      await expect(
        verifyMfaLoginService("mfa-token", "123456"),
      ).rejects.toThrow("User not found.");

      expect(verify).not.toHaveBeenCalled();
    });

    it("should fail when MFA is not enabled", async () => {
      const user = {
        id: 1,
        mfaEnabled: false,
        mfaSecret: "SECRET123",
      };

      jwt.verify.mockReturnValue({
        userId: 1,
        type: "mfa",
      });

      User.findByPk.mockResolvedValue(user);

      await expect(
        verifyMfaLoginService("mfa-token", "123456"),
      ).rejects.toThrow("MFA is not enabled.");

      expect(verify).not.toHaveBeenCalled();
    });

    it("should fail when MFA secret does not exist", async () => {
      const user = {
        id: 1,
        mfaEnabled: true,
        mfaSecret: null,
      };

      jwt.verify.mockReturnValue({
        userId: 1,
        type: "mfa",
      });

      User.findByPk.mockResolvedValue(user);

      await expect(
        verifyMfaLoginService("mfa-token", "123456"),
      ).rejects.toThrow("MFA is not enabled.");

      expect(verify).not.toHaveBeenCalled();
    });

    it("should fail when authenticator code is invalid", async () => {
      const user = {
        id: 1,
        mfaEnabled: true,
        mfaSecret: "SECRET123",
      };

      jwt.verify.mockReturnValue({
        userId: 1,
        type: "mfa",
      });

      User.findByPk.mockResolvedValue(user);

      verify.mockResolvedValue({
        valid: false,
      });

      await expect(
        verifyMfaLoginService("mfa-token", "000000"),
      ).rejects.toThrow("Invalid authenticator code.");

      expect(generateToken).not.toHaveBeenCalled();
    });
  });
});
