import { useEffect, useState } from "react";

import { useNavigate, useParams, useOutletContext } from "react-router-dom";

import { getAllUsers, getMessages } from "../services/chatServices";

import ChatWindow from "../components/chatWindow";

import socket from "../../../services/socket";

import useChatSocket from "../hooks/useChatSocket";

import { BsFillTelephoneFill } from "react-icons/bs";

const ChatPage = () => {
  // Get the userId from the URL
  const { userId } = useParams();

  // Used for navigation between pages
  const navigate = useNavigate();

  // Get the current user from the parent component
  const { currentUser } = useOutletContext();

  // Store the currently selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // Store the messages for the current chat
  const [messages, setMessages] = useState([]);

  const { startCall } = useOutletContext();

  //loadUsers
  useEffect(() => {
    if (!userId) return;
    //Load user function call
    // eslint-disable-next-line react-hooks/immutability
    loadUser();
  }, [userId]);

  // Load all users
  const loadUser = async () => {
    try {
      // Call the getAllUsers service from Chat Services
      const data = await getAllUsers();

      // Stop if users were not fetched successfully
      if (!data.success) {
        return;
      }

      // Find the user whose ID matches the userId from the URL
      const user = data.users.find(
        (item) => String(item.id) === String(userId),
      );

      // Set the selected user for the current chat
      setSelectedUser(user || null);
    } catch (error) {
      console.log("User error:", error);
    }
  };

  // Get messages when the current user or selected chat changes
  useEffect(() => {
    if (!currentUser?.id || !userId) {
      return;
    }

    // First tell server that this chat is open
    socket.emit("openChat", {
      userId: currentUser.id,
      otherUserId: userId,
    });

    // Then load messages and mark them as seen
    loadMessages();

    return () => {
      socket.emit("closeChat", {
        userId: currentUser.id,
        otherUserId: userId,
      });
    };
  }, [currentUser, userId]);

  const loadMessages = async () => {
    try {
      // Get messages for the user whose ID is in the URL
      const data = await getMessages(userId);

      // Continue only if the messages were fetched successfully
      if (data.success) {
        // Store the fetched messages in the messages state
        setMessages(data.messages || []);

        // Mark messages from the selected user as seen
        socket.emit("markSeen", {
          receiverId: currentUser.id,
          senderId: userId,
        });
      }
    } catch (error) {
      console.log("Messages error:", error);
    }
  };

  // SOCKET
  useChatSocket(currentUser, selectedUser, setMessages);
  const handleCall = () => {
    if (!selectedUser) {
      return;
    }

    startCall(selectedUser);
  };

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

          {/* Call button */}
          <button
            className="btn btn-light rounded-circle ms-auto d-flex justify-content-center align-items-center"
            onClick={handleCall}
          >
            <BsFillTelephoneFill size={22} color="black" />
          </button>
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
