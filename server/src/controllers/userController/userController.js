import {
  getCurrentUserService,
  updateProfileService,
  uploadProfileImageService,
  getAllUsersService,
} from "../../services/userServices.js";

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await getCurrentUserService(req.user.id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await updateProfileService(req.user.id, name);

    const io = req.app.get("io");

    // Tell all connected users that this profile was updated
    io.emit("profileUpdated", {
      user: {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
      },
    });

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPLOAD PROFILE IMAGE
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Please select an image.");
    }

    const imagePath = `uploads/profileAvatars/${req.file.filename}`;

    const user = await uploadProfileImageService(req.user.id, imagePath);

    const io = req.app.get("io");

    // Tell all connected users that profile image changed
    io.emit("profileUpdated", {
      user: {
        id: user.id,
        name: user.name,
        profileImage: user.profileImage,
      },
    });

    res.json({
      success: true,
      message: "Profile image uploaded successfully.",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const search = req.query.search || "";

    const users = await getAllUsersService(req.user.id, search);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
