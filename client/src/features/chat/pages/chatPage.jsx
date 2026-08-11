import { useEffect, useState } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import { getAllUsers, getMessages } from "../services/chatServices";

import ChatWindow from "../components/chatWindow";

import socket from "../../../services/socket";

import useChatSocket from "../hooks/useChatSocket";

const ChatPage = () => {
  const { userId } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useOutletContext();

  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);

  // GET SELECTED USER

  useEffect(() => {
    if (!userId) return;

    // eslint-disable-next-line react-hooks/immutability
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      const data = await getAllUsers();

      if (!data.success) {
        return;
      }

      const user = data.users.find(
        (item) => String(item._id) === String(userId),
      );

      setSelectedUser(user || null);
    } catch (error) {
      console.log("User error:", error);
    }
  };

  // GET MESSAGES
  useEffect(() => {
    if (!currentUser?._id || !userId) {
      return;
    }
    // eslint-disable-next-line react-hooks/immutability
    loadMessages();

    socket.emit("openChat", {
      userId: currentUser._id,
      otherUserId: userId,
    });

    return () => {
      socket.emit("closeChat", {
        userId: currentUser._id,
        otherUserId: userId,
      });
    };
  }, [currentUser, userId]);

  const loadMessages = async () => {
    try {
      const data = await getMessages(userId);

      if (data.success) {
        setMessages(data.messages || []);

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

  // SOCKET
  useChatSocket(currentUser, selectedUser, setMessages);

  // LOADING

  if (!selectedUser) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-secondary" role="status" />
      </div>
    );
  }

  return (
    <div className="vh-100 bg-light">
      {/* HEADER */}

      <div className="bg-white border-bottom p-3">
        <div className="d-flex align-items-center">
          {/* Back */}

          <button
            className="btn btn-light rounded-circle me-3"
            onClick={() => navigate("/chat/users")}
          >
            <i className="bi bi-arrow-left" />
          </button>

          {/* Profile */}

          <img
            src={
              selectedUser.profileImage
                ? `http://localhost:5000/${selectedUser.profileImage}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedUser.name,
                  )}&background=random`
            }
            alt={selectedUser.name}
            className="rounded-circle"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "cover",
            }}
          />

          {/* Name */}

          <div className="ms-3">
            <h6 className="mb-0 fw-semibold">{selectedUser.name}</h6>

            <small className="text-muted">{selectedUser.email}</small>
          </div>
        </div>
      </div>

      {/* CHAT*/}

      <div
        style={{
          height: "calc(100vh - 77px)",
        }}
      >
        <ChatWindow
          currentUser={currentUser}
          selectedUser={selectedUser}
          messages={messages}
        />
      </div>
    </div>
  );
};

export default ChatPage;
