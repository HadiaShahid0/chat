import { useEffect, useRef, useState } from "react";
import ChatBubble from "./chatBubble";
import socket from "../../../services/socket";

const ChatWindow = ({ currentUser, selectedUser, messages = [] }) => {
  // Store the message text entered by the user
  const [text, setText] = useState("");

  // Create a reference to the end of the messages list
  const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    // Automatically scroll to the latest message 
    // when the chat opens or a new message is added
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send a message
  const sendMessage = () => {
    // Stop if the message text is empty
    if (!text.trim()) {
      return;
    }

    // Stop if the current user ID is not available
    if (!currentUser?._id) {
      return;
    }

    // Stop if the selected user's ID is not available
    if (!selectedUser?._id) {
      return;
    }

    // Send the message to the server through Socket.IO
    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: text.trim(),
    });

    // Clear the input after sending the message
    setText("");
  };

  // Send the message when the user presses the Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* MESSAGES*/}

      <div
        className="flex-grow-1 overflow-auto p-4"
        style={{
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.length === 0 ? (
          <div className="h-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="mb-3">
                <i className="bi bi-chat-square-text fs-1 text-secondary"></i>
              </div>

              <h5 className="fw-semibold">Start a conversation</h5>

              <p className="text-muted">
                Send a message to {selectedUser?.name || "this user"}
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatBubble
              key={message._id}
              message={message}
              currentUser={currentUser}
            />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* MESSAGE INPUT*/}

      <div className="bg-white border-top p-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control bg-light border-0 shadow-none"
            placeholder={`Message ${selectedUser?.name || ""}...`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={sendMessage}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
