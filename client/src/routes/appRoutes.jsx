import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/login";
import Register from "../features/auth/pages/register";

import ChatPage from "../features/chat/pages/chatPage";
import ChatUsers from "../features/chat/pages/chatUsers";
import ChatLayout from "..//components/layout/callLayout";

import ProtectedRoute from "./protectedRoutes";
import Profile from "../features/profile/pages/profile";
import AppLayout from "../components/layout/AppLayout";
import OtpForm from "../features/auth/components/otpForm"
import MfaSetup from "../features/auth/pages/mfaSetup";
import MfaLogin from "../features/auth/pages/mfaLogin";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OtpForm />} />
      <Route path="/mfa-login" element={<MfaLogin/>}/>
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
        <Route path="/mfa-setup" element={<MfaSetup/>}/>
        {/* Other pages */}
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
