import {
  getMessagesService,
} from "../../services/messageServices.js";


// Get messages between logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await getMessagesService(
      req.user._id,
      userId,
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.log(
      "Get messages error:",
      error.message,
    );

    res.status(500).json({
      success: false,
      message: "Failed to get messages.",
    });
  }
};