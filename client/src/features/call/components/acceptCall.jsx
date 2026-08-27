import React, { useEffect, useState } from "react";

const AcceptCall = ({ caller, onEndCall }) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    if (!caller) return;

    // Start the call timer
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);

      setCallDuration(elapsedTime);
    }, 1000);

    // Stop timer when call ends
    return () => {
      clearInterval(timer);
    };
  }, [caller]);

  // Convert seconds to minutes and seconds
  const minutes = Math.floor(callDuration / 60);
  const seconds = callDuration % 60;

  const formattedTime = `${String(minutes).padStart(
    2,
    "0",
  )}:${String(seconds).padStart(2, "0")}`;

  if (!caller) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-body text-center p-4 p-md-5">
            {/* CALLER */}
            <div className="d-flex flex-column align-items-center mb-4">
              <img
                src={
                  caller.profileImage
                    ? `http://localhost:5000/${caller.profileImage}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        caller.name || "User",
                      )}&background=random`
                }
                alt={caller.name || "User"}
                className="rounded-circle mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                }}
              />

              <h5 className="fw-semibold mb-1">{caller.name || "User"}</h5>
                <audio 
                    id="remoteAudio"
                    autoPlay/>
              <div className="text-muted small">Audio call</div>

              {/* CALL DURATION */}
              <div className="text-muted small mt-1">{formattedTime}</div>
            </div>

            {/* END CALL */}
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                }}
                onClick={onEndCall}
              >
                <i className="bi bi-telephone-x-fill fs-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptCall;
