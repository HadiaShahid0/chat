import { useEffect } from "react";
import socket from "../../../services/socket";

const useChatSocket = (currentUser, selectedUser, setMessages) => {
  useEffect(() => {
    // Do nothing until the logged-in user is available
    if (!currentUser?._id) {
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
      if (String(message.sender) !== String(selectedUser?._id)) {
        return;
      }

      addMessage(message);
    };

    // When the message status changes
    const handleMessageStatusUpdate = ({ messageId, status, receiverId }) => {
      setMessages((prevMessages) =>

        // Go through all existing messages
        prevMessages.map((message) => {
          //messageId condition handles one specific message,
          // while isBulkSeenUpdate handles multiple messages becoming seen at once.

          // Check if this is the specific message whose status changed
          const isTargetMessage =
            messageId && String(message._id) === String(messageId);

          // the message was sent by me,
          // and it was sent to the receiver who saw it
          
          const isBulkSeenUpdate =
          //if remove sender compare with currentUser Id and the receiver is offline
          //  when it logins it directs seen the message 
          // without deliver it and even the chat is not opened
            String(message.sender) === String(currentUser._id) &&
            String(message.receiver) === String(receiverId);

          // If either condition is true,
          // update this message's status
          if (isTargetMessage || isBulkSeenUpdate) {
            return { ...message, status };
          }

          // Otherwise, keep the message unchanged
          return message;
        }),
      );
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
  }, [currentUser, selectedUser, setMessages]);// Runs when currentUser, selectedUser, or setMessages changes.
};

export default useChatSocket;
