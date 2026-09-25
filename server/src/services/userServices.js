import { User } from "../models/index.js";
import { Op } from "sequelize";

// Get the currently logged-in user
export const getCurrentUserService = async (userId) => {
  const user = await User.findByPk(userId, {
    // Don't return the password
    attributes: {
      exclude: ["password"],
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

// Update user's name
export const updateProfileService = async (userId, name) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Change the name
  user.name = name;

  // Save the changes in MySQL
  await user.save();

  // Don't return password
  user.password = undefined;

  return user;
};

// Upload/update profile image
export const uploadProfileImageService = async (userId, imagePath) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  // Change profile image
  user.profileImage = imagePath;

  // Save the changes
  await user.save();

  // Don't return password
  user.password = undefined;

  return user;
};

// Get all users except current user
export const getAllUsersService = async (userId, search = "") => {
  // Create conditions
  const where = {
    // Don't include the current user
    id: {
      [Op.ne]: userId,
    },
  };

  // If search text exists
  if (search) {
    where.name = {
      // Case-insensitive search
      [Op.like]: `%${search}%`,
    };
  }

  const users = await User.findAll({
    where,

    // Don't return passwords
    attributes: {
      exclude: ["password"],
    },

    // Sort alphabetically by name
    order: [["name", "ASC"]],
  });

  return users;
};
// import User from "../models/userModel.js";

// export const getCurrentUserService = async (userId) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   return user;
// };

// export const updateProfileService = async (userId, name) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   user.name = name;

//   await user.save();

//   return user;
// };

// export const uploadProfileImageService = async (userId, imagePath) => {
//   const user = await User.findById(userId);

//   if (!user) {
//     throw new Error("User not found.");
//   }

//   user.profileImage = imagePath;

//   await user.save();

//   return user;
// };

// export const getAllUsersService = async (userId, search = "") => {
//   const query = {
//     _id: { $ne: userId },
//   };

//   if (search) {
//     query.name = {
//       $regex: search,
//       $options: "i",
//     };
//   }

//   const users = await User.find(query)
//     .select("-password")
//     .sort({ name: 1 });

//   return users;
// };
