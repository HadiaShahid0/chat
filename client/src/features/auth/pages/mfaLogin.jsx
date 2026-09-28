import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { verifyMfaLogin } from "../services/authServices";

const MfaLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const mfaToken = location.state?.mfaToken;

  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!mfaToken) {
      setError("MFA session expired. Please login again.");
      return;
    }

    if (token.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      setLoading(true);

      await verifyMfaLogin(mfaToken, token);

      navigate("/chat/users");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body p-4 p-md-5 text-center">
          <div
            className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{
              width: "75px",
              height: "75px",
            }}
          >
            🔐
          </div>

          <h2 className="fw-bold mb-2">Two-Factor Authentication</h2>

          <p className="text-muted mb-4">
            Enter the 6-digit code from your authenticator app.
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
              className={`form-control form-control-lg text-center ${
                error ? "is-invalid" : ""
              }`}
              placeholder="000000"
              value={token}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");

                setToken(value);
                setError("");
              }}
              style={{
                letterSpacing: "8px",
                fontWeight: "bold",
              }}
            />

            {error && (
              <div className="invalid-feedback text-start">{error}</div>
            )}

            <button
              type="submit"
              className="btn btn-dark btn-lg w-100 mt-4"
              disabled={loading || token.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MfaLogin;
