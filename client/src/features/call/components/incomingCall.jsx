import React from "react";

const IncomingCall = ({ caller, onAccept, onReject}) => {
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
            {/* CALL ICON */}

            <div
              className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "50px",
                height: "50px",
                background: "linear-gradient(135deg, #198754, #20c997)",
                boxShadow: "0 10px 30px rgba(25, 135, 84, 0.3)",
              }}
            >
              <i
                className="bi bi-telephone-fill text-white"
                style={{
                  fontSize: "34px",
                }}
              />
            </div>

            {/* TITLE */}

            <h4 className="fw-bold mb-2">Incoming Call</h4>
            {/* CALLER */}
            <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
              <img
                src={
                  caller.profileImage
                    ? `http://localhost:5000/${caller.profileImage}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        caller.name || "User",
                      )}&background=random`
                }
                alt={caller.name || "User"}
                className="rounded-circle"
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "cover",
                }}
              />

              <div className="text-start">
                <h5 className="fw-semibold mb-1">{caller.name || "User"}</h5>

                <span className="text-muted small">Audio call</span>
              </div>
            </div>

            {/* BUTTONS */}

            <div className="d-flex justify-content-center gap-3">
              {/* REJECT */}

              <button
                type="button"
                className="btn btn-danger rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                onClick={onReject}
              >
                <i className="bi bi-telephone-x-fill" />
                Reject
              </button>

              {/* ACCEPT */}

              <button
                type="button"
                className="btn btn-success rounded-pill px-4 py-2 d-flex align-items-center gap-2"
                onClick={onAccept}
              >
                <i className="bi bi-telephone-fill" />
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
