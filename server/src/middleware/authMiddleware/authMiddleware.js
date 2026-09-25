import User from "../../models/userModel.js";
import { verifyToken } from "../../utils/jwt.js";

const protect = async (req, res, next) => {
  try {
    // Get JWT token from cookie
    const token = req.cookies.token;

    // If no token exists, user is not logged in
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login.",
      });
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    // Find user using Sequelize primary key
    const user = await User.findByPk(decoded.id);

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Store user on request
    req.user = user;

    // Continue to verify controller
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

export default protect;
