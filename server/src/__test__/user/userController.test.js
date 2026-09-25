import { describe, it, expect, vi, beforeEach } from "vitest";

import {
  getCurrentUserService,
  updateProfileService,
  uploadProfileImageService,
  getAllUsersService,
} from "../../services/userServices";

import {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
  getAllUsers,
} from "../../controllers/userController/userController";

vi.mock("../../services/userServices.js", () => ({
  getCurrentUserService: vi.fn(),
  updateProfileService: vi.fn(),
  uploadProfileImageService: vi.fn(),
  getAllUsersService: vi.fn(),
}));

describe("User Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets the current user successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    const user = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
    };

    getCurrentUserService.mockResolvedValue(user);

    await getCurrentUser(req, res);

    expect(getCurrentUserService).toHaveBeenCalledWith(1);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      user,
    });
  });

  it("returns error when current user is not found", async () => {
    const req = {
      user: {
        id: 1,
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    getCurrentUserService.mockRejectedValue(new Error("User not found."));

    await getCurrentUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User not found.",
    });
  });

  it("updates the user profile successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        name: "Updated User",
      },
      app: {
        get: vi.fn().mockReturnValue({
          emit: vi.fn(),
        }),
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    const user = {
      id: 1,
      name: "Updated User",
      profileImage: "profile.jpg",
    };

    updateProfileService.mockResolvedValue(user);

    await updateProfile(req, res);

    expect(updateProfileService).toHaveBeenCalledWith(1, "Updated User");

    expect(req.app.get).toHaveBeenCalledWith("io");

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  });

  it("returns error when no profile image is selected", async () => {
    const req = {
      user: {
        id: 1,
      },
      body: {
        name: "Updated User",
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    updateProfileService.mockRejectedValue(
      new Error("Unable to update profile."),
    );

    await updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unable to update profile.",
    });
  });
  it("upload profile image successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      file: {
        filename: "profile.png",
      },
      app: {
        get: vi.fn().mockReturnValue({
          emit: vi.fn(),
        }),
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    const user = {
      id: 1,
      name: "User 1",
      profileImage: "uploads/profileAvatars/profile.png",
    };

    uploadProfileImageService.mockResolvedValue(user);

    await uploadProfileImage(req, res);

    expect(uploadProfileImageService).toHaveBeenCalledWith(
      1,
      "uploads/profileAvatars/profile.png",
    );

    expect(req.app.get).toHaveBeenCalledWith("io");
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "Profile image uploaded successfully.",
      user,
    });
  });

  it("returns error when user profileImage upload failed", async () => {
    const req = {
      user: {
        id: 1,
      },
      file: {
        filename: "profile.png",
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    uploadProfileImageService.mockRejectedValue(
      new Error("Please select an image."),
    );

    await uploadProfileImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Please select an image.",
    });
  });

  it("get all the users successully", async () => {
    const req = {
      user: {
        id: 1,
      },
      query: {
        search: "User 1",
      },
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    const users = {
      id: 1,
      name: "User 1",
      email: "user1@example.com",
    };

    getAllUsersService.mockResolvedValue(users);
    await getAllUsers(req, res);

    expect(getAllUsersService).toHaveBeenCalledWith(1, "User 1");
    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      users,
    });
  });

  it("returns error when getting all users fails", async () => {
    const req = {
      user: {
        id: 1,
      },
      query: {},
    };

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    getAllUsersService.mockRejectedValue(new Error("Unable to get users."));
    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Unable to get users.",
    });
  });
});
