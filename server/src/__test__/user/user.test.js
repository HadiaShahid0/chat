import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../models/index.js", () => ({
  User: {
    findByPk: vi.fn(),
    findAll: vi.fn(),
  },
}));

import { User } from "../../models/index.js";

import {
  getCurrentUserService,
  updateProfileService,
  uploadProfileImageService,
  getAllUsersService,
} from "../../services/userServices.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Get Current User", () => {
  it("gets the current user successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      email: "test@gmail.com",
    };

    User.findByPk.mockResolvedValue(user);

    const result = await getCurrentUserService(1);

    expect(result).toEqual(user);

    expect(User.findByPk).toHaveBeenCalledWith(1, {
      attributes: {
        exclude: ["password"],  
      },
    });
  });

  it("failes when the current user does not exist", async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(getCurrentUserService(23)).rejects.toThrow("User not found");
  });
});

describe("Update Profile", () => {
  it("updates user's name successfully", async () => {
    const user = {
      id: 1,
      name: "Old name",
      password: "hashed-password",
      save: vi.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(user);

    const result = await updateProfileService(1, "New name");

    expect(user.name).toBe("New name");

    expect(user.save).toHaveBeenCalled();
    expect(result.password).toBeUndefined();
  });

  it("cannot update profile when user doesnot exist", async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(updateProfileService(23, "New name")).rejects.toThrow(
      "User not found",
    );
  });
});

describe("Profile Image", () => {
  it("update profile image successfully", async () => {
    const user = {
      id: 1,
      name: "Test User",
      profileImage: null,
      password: "hashed-password",
      save: vi.fn().mockResolvedValue(true),
    };

    User.findByPk.mockResolvedValue(user);

    const result = await uploadProfileImageService(
      1,
      "uploads/profileAvatars/test.jpg",
    );
    expect(user.profileImage).toBe("uploads/profileAvatars/test.jpg");
    expect(user.save).toHaveBeenCalled();
    expect(result.password).toBeUndefined();
  });
  it("cannot update profile image when user doesnot exist", async () => {
    User.findByPk.mockResolvedValue(null);

    await expect(
      uploadProfileImageService(23, "uploads/profileAvatars/test.jpg"),
    ).rejects.toThrow("User not found");
  });
});

describe("Get All users", () => {
  it("gets all users except the current user", async () => {
    const users = [
      {
        id: 1,
        name: "User 1",
        email: "user1@gmail.com",
      },
      {
        id: 2,
        name: "User 2",
        email: "user2@gmail.com",
      },
    ];

    User.findAll.mockResolvedValue(users);

    const allUsers = await getAllUsersService(1);

    expect(allUsers).toEqual(users);

    expect(User.findAll).toHaveBeenCalled();
  });

  it("searches users by name", async () => {
    const users = [
      {
        id: 1,
        name: "User 1",
        email: "user1@gmail.com",
      },
    ];

    User.findAll.mockResolvedValue(users);

    const allUsers = await getAllUsersService(1, "User 1");

    expect(allUsers).toEqual(users);
    const call = User.findAll.mock.calls[0][0];
    expect(call.where.name).toBeDefined();
  });
});
