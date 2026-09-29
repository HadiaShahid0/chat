import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  setupMfaService,
  verifyMfaSetupService,
  disableMfaService,
} from "../../services/mfaServices";

import {
  setupMfa,
  verifyMfaSetup,
  disableMfa,
} from "../../controllers/mfaController/mfaController";

vi.mock("../../services/mfaServices.js", () => ({
  setupMfaService: vi.fn(),
  verifyMfaSetupService: vi.fn(),
  disableMfaService: vi.fn(),
}));

describe("MFA Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("setup MFA", () => {
    it("should setup MFA successfully", async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const result = { qrCode: "data:image/png;base64,test-qr-code" };

      setupMfaService.mockResolvedValue(result);
      await setupMfa(req, res);
      expect(setupMfaService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });

    it("should return when MFA setup fails", async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      setupMfaService.mockRejectedValue(new Error("MFA is already enabled"));
      await setupMfa(req, res);

      expect(setupMfaService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "MFA is already enabled",
      });
    });
  });

  describe("verifyMfaSetup", () => {
    it("should verify MFA setup successfully", async () => {
      const req = { user: { id: 1 }, body: { token: "123456" } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const result = { message: "MFA enabled successfully" };
      verifyMfaSetupService.mockResolvedValue(result);
      await verifyMfaSetup(req, res);
      expect(verifyMfaSetupService).toHaveBeenCalledWith(1, "123456");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it("should return error when MFA verification failed", async () => {
      const req = { user: { id: 1 }, body: { token: "000000" } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      verifyMfaSetupService.mockRejectedValue(
        new Error("Invalid authenticator code."),
      );
      await verifyMfaSetup(req, res);
      expect(verifyMfaSetupService).toHaveBeenCalledWith(1, "000000");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid authenticator code.",
      });
    });
    it("should return error when MFA setup has not been started", async () => {
      const req = { user: { id: 1 }, body: { token: "000000" } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      verifyMfaSetupService.mockRejectedValue(
        new Error("MFA setup has not been started"),
      );
      await verifyMfaSetup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "MFA setup has not been started",
      });
    });
  });

  describe("disableMfa", () => {
    it("should be diable MFA successfully", async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const result = { message: "MFA disabled successfully" };
      disableMfaService.mockResolvedValue(result);
      await disableMfa(req, res);
      expect(disableMfaService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(result);
    });
    it("should return error when disabling MFA fails", async () => {
      const req = { user: { id: 1 } };
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
      const result = { message: "MFA disabled successfully" };
      disableMfaService.mockRejectedValue(new Error("User not found"));
      await disableMfa(req, res);
      expect(disableMfaService).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });
});
