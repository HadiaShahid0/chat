import { useEffect } from "react";
import socket from "../../../services/socket";

const useChatSocket = (currentUser, selectedUser, setMessages) => {
  useEffect(() => {
    // Do nothing until the logged-in user is available
    if (!currentUser?.id) {
      return;
    }

    // Add a message to the current chat, get all the previous messages and add the latest message at the end
    const addMessage = (message) => {
      setMessages((prevMessages) => {
        return [...prevMessages, message];
      });
    };

    // When the sender successfully sends a message
    const handleMessageSent = (message) => {
      addMessage(message);
    };

    // When the receiver gets a new message
    const handleReceiveMessage = (message) => {
      // Make sure this message belongs to the receiver/selectedUser
      if (String(message.senderId) !== String(selectedUser?.id)) {
        return;
      }

      addMessage(message);
    };

    // When the message status changes
    const handleMessageStatusUpdate = ({ messageId, status }) => {
      setMessages((prevMessages) => {
        return prevMessages.map((message) => {
          if (String(message.id) === String(messageId)) {
            return {
              ...message,
              status,
            };
          }

          return message;
        });
      });
    };

    // Listen for socket events
    socket.on("messageSent", handleMessageSent);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageStatusUpdate", handleMessageStatusUpdate);

    // Remove listeners when component is closed/changed
    return () => {
      socket.off("messageSent", handleMessageSent);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
    };
  }, [currentUser, selectedUser, setMessages]); // Runs when currentUser, selectedUser, or setMessages changes.
};

export default useChatSocket;
