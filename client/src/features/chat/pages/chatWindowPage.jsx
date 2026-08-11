import { useEffect, useState } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import { getMessages, getAllUsers } from "../services/chatServices";

import ChatWindow from "../components/chatWindow";

import socket from "../../../services/socket";

const ChatWindowPage = () => {
  const { userId } = useParams();

  const { currentUser } = useOutletContext();

  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  // Get selected user

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadSelectedUser();
  }, [userId]);

  const loadSelectedUser = async () => {
    try {
      const data = await getAllUsers();

      if (!data.success) {
        return;
      }

      const user = data.users.find(
        (item) => String(item._id) === String(userId),
      );

      if (user) {
        setSelectedUser(user);
      }
    } catch (error) {
      console.log("Selected user error:", error);
    }
  };

  // Get messages

  useEffect(() => {
    if (!userId) {
      return;
    }

    // eslint-disable-next-line react-hooks/immutability
    loadMessages();
  }, [userId]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(userId);

      if (data.success) {
        setMessages(data.messages);

        // Mark messages as seen

        socket.emit("markSeen", {
          receiverId: currentUser._id,

          senderId: userId,
        });
      }
    } catch (error) {
      console.log("Messages error:", error);
    }
  };

  return (
    <div className="container-fluid p-0 vh-100 bg-light">
      <div className="row g-0 h-100">
        <div className="col-12">
          <div className="card border-0 rounded-0 h-100 shadow-sm">
            {/* Chat Header */}

            <div className="card-header bg-white border-bottom p-3">
              <div className="d-flex align-items-center">
                <button
                  className="btn btn-light rounded-circle me-3"
                  onClick={() => navigate("/chat/users")}
                >
                  <i className="bi bi-arrow-left"></i>
                </button>

                {selectedUser && (
                  <>
                    <img
                      src={
                        selectedUser.profileImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          selectedUser.name,
                        )}&background=random`
                      }
                      alt={selectedUser.name}
                      width="45"
                      height="45"
                      className="rounded-circle"
                    />

                    <div className="ms-3">
                      <h6 className="mb-0 fw-bold">{selectedUser.name}</h6>

                      <small className="text-muted">{selectedUser.email}</small>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Chat */}

            <div className="card-body p-0 overflow-hidden">
              {selectedUser ? (
                <ChatWindow
                  currentUser={currentUser}
                  selectedUser={selectedUser}
                  messages={messages}
                />
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100">
                  <div className="text-center">
                    <div className="mb-3">
                      <i className="bi bi-chat-dots fs-1 text-secondary"></i>
                    </div>

                    <h5>Loading conversation...</h5>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindowPage;
