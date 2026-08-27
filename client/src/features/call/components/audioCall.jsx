import React from "react";
import AcceptCall from "./acceptCall";

const AudioCall = ({
  user,
  callStatus = "calling",
  onEndCall,
}) => {
  const userName = user?.name || "User";

  const profileImage =
    user?.profileImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}`;

  const isConnected = callStatus === "connected";

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(8px)",
        zIndex: 1055,
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg text-center p-4"
        style={{
          width: "350px",
          maxWidth: "90%",
        }}
      >
        {/* Profile */}
        <img
          src={profileImage}
          alt={userName}
          className="rounded-circle mb-3"
          style={{
            width: "110px",
            height: "110px",
            objectFit: "cover",
          }}
        />

        {/* Name */}
        <h4 className="fw-bold mb-2">{userName}</h4>

        {/* Status */}
        <p className="text-muted mb-4">
          {isConnected ? "Connected" : "Calling..."}
        </p>

        {/* Controls */}
        <div className="d-flex justify-content-center gap-3">
      
          <button
            type="button"
            className="btn btn-danger rounded-circle"
            style={{
              width: "60px",
              height: "60px",
            }}
            onClick={onEndCall}
          >
            <i className="bi bi-telephone-x-fill" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
