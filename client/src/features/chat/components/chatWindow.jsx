import { useEffect, useRef, useState } from "react";
import ChatBubble from "./chatBubble";
import socket from "../../../services/socket";

const ChatWindow = ({ currentUser, selectedUser, messages = [] }) => {
  const [text, setText] = useState("");

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) {
      return;
    }

    if (!currentUser?._id) {
      return;
    }

    if (!selectedUser?._id) {
      return;
    }

    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: text.trim(),
    });

    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* =========================
          MESSAGES
      ========================= */}

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

      {/* =========================
          MESSAGE INPUT
      ========================= */}

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
