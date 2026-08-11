import { useEffect } from "react";
import socket from "../../../services/socket";

const useChatSocket = (currentUser, selectedUser, setMessages) => {
  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    // =========================
    // MESSAGE SENT
    // =========================

    const handleMessageSent = (message) => {
      // Only show if this is the
      // currently selected chat

      if (String(message.receiver) !== String(selectedUser?._id)) {
        return;
      }

      setMessages((prev) => [...prev, message]);
    };

    // =========================
    // RECEIVE MESSAGE
    // =========================

    const handleReceiveMessage = (message) => {
      // Only add message if it belongs
      // to the currently open chat

      if (String(message.sender) !== String(selectedUser?._id)) {
        return;
      }

      setMessages((prev) => [...prev, message]);
    };

    // =========================
    // MESSAGE DELIVERED
    // =========================

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((message) => {
          if (String(message._id) === String(messageId)) {
            return {
              ...message,
              status: "delivered",
            };
          }

          return message;
        }),
      );
    };

    // =========================
    // MESSAGES SEEN
    // =========================

    const handleMessagesSeen = ({ seenBy }) => {
      setMessages((prev) =>
        prev.map((message) => {
          if (
            String(message.sender) === String(currentUser._id) &&
            String(message.receiver) === String(seenBy)
          ) {
            return {
              ...message,
              status: "seen",
            };
          }

          return message;
        }),
      );
    };

    socket.on("messageSent", handleMessageSent);

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("messageDelivered", handleMessageDelivered);

    socket.on("messagesSeen", handleMessagesSeen);

    return () => {
      socket.off("messageSent", handleMessageSent);

      socket.off("receiveMessage", handleReceiveMessage);

      socket.off("messageDelivered", handleMessageDelivered);

      socket.off("messagesSeen", handleMessagesSeen);
    };
  }, [currentUser, selectedUser, setMessages]);
};

export default useChatSocket;
