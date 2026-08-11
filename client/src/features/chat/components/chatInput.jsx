import { useState } from "react";

import socket from "../../../services/socket";

const ChatInput = ({ currentUser, selectedUser }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

     if (!text.trim()) {
      return;
    }

    socket.emit("sendMessage", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
      text: text.trim(),
    });

    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex gap-2 p-3 border-top">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button type="submit" className="btn btn-secondary">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
