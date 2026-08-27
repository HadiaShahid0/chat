import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";

import ChatPage from "../features/chat/pages/chatPage";
import ChatUsers from "../features/chat/pages/chatUsers";
import ChatLayout from "..//components/layout/callLayout";

import ProtectedRoute from "./protectedRoutes";
import Profile from "../features/profile/pages/profile";
import AppLayout from "../components/layout/AppLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Chat section */}
        <Route element={<ChatLayout />}>
          <Route path="/chat/users" element={<ChatUsers />} />
          <Route path="/chat/:userId" element={<ChatPage />} />
        </Route>

        {/* Other pages */}
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
