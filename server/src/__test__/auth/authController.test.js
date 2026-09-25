import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  registerService,
  loginService,
  verifyService,
  logoutService,
} from "../../services/authServices";

import {
  register,
  login,
  verify,
  logout,
} from "../../controllers/authController/authController";

vi.mock("../../services/authServices.js", () => ({
  registerService: vi.fn(),
  loginService: vi.fn(),
  verifyService: vi.fn(),
  logoutService: vi.fn(),
}));

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("register a user successfully", async () => {
    const user={
        id: 1,
        name: "Test User",
        email: "test@example.com",
    }
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
});
