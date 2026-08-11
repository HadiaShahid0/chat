import { useEffect } from "react";
import socket from "../../../services/socket";

const useChatSocket = (currentUser, selectedUser, setMessages) => {
  useEffect(() => {
    //Check the logged user exist if not then return
    if (!currentUser?._id) {
      return;
    }

    // MESSAGE SENT
    const handleMessageSent = (message) => {
        // Check the receiver who receives the message is whether that whose chat is selected, from this code it make sure the message belongs to the currently open chat.
      if (String(message.receiver) !== String(selectedUser?._id)) {
        return;
      }

      //prev means the current message already stored in react state
      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some(
          (item) => String(item._id) === String(message._id),
        );

        if (exists) {
          return prev;
        }

        //keep all the previous message and add the current message at the end
        return [...prev, message];
      });
    };

    // RECEIVE MESSAGE
    const handleReceiveMessage = (message) => {
      // Only add the message if it belongs to the open chat
      if (String(message.sender) !== String(selectedUser?._id)) {
        return;
      }

      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some(
          (item) => String(item._id) === String(message._id),
        );

        if (exists) {
          return prev;
        }

        return [...prev, message];
      });
    };

    // MESSAGE STATUS UPDATE
    const handleMessageStatusUpdate = ({
      messageId,
      status,
      senderId,
      receiverId,
    }) => {
      setMessages((prev) =>
        prev.map((message) => {
          // If messageId is provided,  update only that message
            //Is this the message whose status needs to change?
          if (messageId && String(message._id) === String(messageId)) {
            return {
              ...message,
              status,
            };
          }

          // Used when multiple messages are marked as seen

          if (
            status === "seen" &&
            senderId &&
            receiverId &&
            String(message.sender) === String(currentUser._id) &&
            String(message.receiver) === String(receiverId)
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

    // LISTEN TO SOCKET EVENTS
    socket.on("messageSent", handleMessageSent);

    socket.on("receiveMessage", handleReceiveMessage);

    socket.on("messageStatusUpdate", handleMessageStatusUpdate);

    // CLEANUP
    return () => {
      socket.off("messageSent", handleMessageSent);

      socket.off("receiveMessage", handleReceiveMessage);

      socket.off("messageStatusUpdate", handleMessageStatusUpdate);
    };
  }, [currentUser, selectedUser, setMessages]);
};

export default useChatSocket;
