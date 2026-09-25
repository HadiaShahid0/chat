import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import NavigationSidebar from "../common/navigationSidebar";

import { verify, logout } from "../../features/auth/services/authServices";

import socket from "../../services/socket";
const AppLayout = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // LOAD CURRENT USER
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await verify();

        if (response.success) {
          setUser(response.user);
        }
      } catch (error) {
        console.log(error.message);
        navigate("/login");
      }
    };

    loadUser();
  }, [navigate]);

  // SOCKET
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    //emit the join
    const onConnect = () => {
      console.log("Socket Connected:", socket.id);

      socket.emit("join", user.id);
    };
    //disconnect the socket
    const onDisconnect = () => {
      console.log("Socket Disconnected");
    };

    const profileUpdatedHandler = ({ user: updatedUser }) => {
      // Stop if the updated user's ID does not match the current user's ID
      if (String(updatedUser.id) !== String(user.id)) {
        return;
      }

      // Update the user state with the new profile data
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));
    };

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("profileUpdated", profileUpdatedHandler);

    if (!socket.connected) {
      socket.connect();
    } else {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);

      socket.off("disconnect", onDisconnect);

      socket.off("profileUpdated", profileUpdatedHandler);
    };
  }, [user]);

  // LOGOUT
  const handleLogout = async () => {
    try {
      await logout();

      socket.disconnect();

      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

  // LOADING
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-secondary"></div>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100">
      <NavigationSidebar user={user} onLogout={handleLogout} />

      <div className="flex-grow-1">
        <Outlet
          context={{
            currentUser: user,
          }}
        />
      </div>
    </div>
  );
};

export default AppLayout;
