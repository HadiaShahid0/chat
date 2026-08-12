import {
  BsChatDotsFill,
  BsPersonCircle,
  BsBoxArrowRight,
} from "react-icons/bs";

import { Link, useLocation } from "react-router-dom";

const NavigationSidebar = ({ user, onLogout }) => {
  const location = useLocation();

  const isChatActive = location.pathname.startsWith("/chat");

  const isProfileActive = location.pathname === "/profile";

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-between bg-dark text-white py-3"
      style={{
        width: "70px",
        height: "100vh",
        flexShrink: 0,
      }}
    >
      {/*TOP SECTION*/}

      <div className="d-flex flex-column align-items-center gap-4">
        {/* Profile Image */}

        <Link to="/profile" className="text-decoration-none">
          <img
            src={
              user?.profileImage
                ? `http://localhost:5000/${user.profileImage}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User",
                  )}&background=random`
            }
            alt="Profile"
            className="rounded-circle border border-2 border-light"
            style={{
              width: "45px",
              height: "45px",
              objectFit: "cover",
            }}
          />
        </Link>

        {/* Chat */}

        <Link
          to="/chat/users"
          className={`text-decoration-none rounded p-2 ${
            isChatActive ? "bg-secondary text-white" : "text-white"
          }`}
          title="Chats"
        >
          <BsChatDotsFill size={23} />
        </Link>

        {/* Profile */}

        <Link
          to="/profile"
          className={`text-decoration-none rounded p-2 ${
            isProfileActive ? "bg-secondary text-white" : "text-white"
          }`}
          title="Profile"
        >
          <BsPersonCircle size={23} />
        </Link>
      </div>

      {/* LOGOUT*/}

      <button
        className="btn btn-link text-white p-2 rounded"
        onClick={onLogout}
        title="Logout"
      >
        <BsBoxArrowRight size={23} />
      </button>
    </div>
  );
};

export default NavigationSidebar;
