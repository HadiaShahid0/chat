import { describe, it, expect, vi, beforeEach } from "vitest";

import User from "../../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.js";

import {
  registerService,
  loginService,
  verifyService,
  logoutService,
} from "../../services/authServices.js";

vi.mock("../../models/userModel.js", () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
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
}));
beforeEach(() => {
  vi.clearAllMocks();
});

describe("auth", () => {
  it("user can register successfully", async () => {
    bcrypt.hash.mockResolvedValue("hashed-password");

    const users = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    };

    User.create.mockResolvedValue(users);

    const user = await registerService("Test User", "test@gmail.com", "123456");

    expect(user).toEqual(users);

    expect(User.create).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    });
  });

  it("cannot register with an existing email", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      email: "test@gmail.com",
    });

    (await expect(
      registerService("Test User", "test@gmail.com", "123456"),
    ).rejects.toThrow("Email already exists"),
      expect(User.create).not.toHaveBeenCalled());
  });

  it("hashing the password before creating the user", async () => {
    User.findOne.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed-password");
    User.create.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    });

    await registerService("Test User", "test@gmail.com", "123456");

    expect(bcrypt.hash).toHaveBeenCalled("123456", 10);
  });

  it("user can login successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
      password: "hashed-password",
    };

    User.findOne.mockResolvedValue(user);

    bcrypt.compare.mockResolvedValue(true);

    generateToken.mockReturnValue("test-token");

    const result = await loginService("test@gmail.com", "123456");

    expect(result).toEqual({
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

  it("user can logout successfully", async () => {
    const logout = logoutService();
    expect(logout).toBe(true);
  });
});
