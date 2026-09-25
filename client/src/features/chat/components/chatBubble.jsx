const ChatBubble = ({ message, currentUser }) => {
  // Check if this message was sent by the current user
  const isMine = String(message.senderId) === String(currentUser.id);
  return (
    <div
      className={`d-flex mb-3 ${
        isMine ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        className={`px-3 py-2 ${
          isMine ? "bg-secondary text-white" : "bg-white"
        } shadow-sm`}
        style={{
          maxWidth: "70%",
          borderRadius: "18px",
        }}
      >
        <div>{message.text}</div>

        {isMine && (
          <div className="text-end mt-1">
            <div
              className={
                message.status === "seen" ? "text-info" : "text-white-50"
              }
            >
              {message.status === "sent" && <i className="bi bi-check"></i>}

              {message.status === "delivered" && (
                <i className="bi bi-check2-all"></i>
              )}

              {message.status === "seen" && (
                <i className="bi bi-check2-all"></i>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble;
