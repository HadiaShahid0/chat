import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authServices";

const OtpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Email not found. Please register again.");
      return;
    }

    if (otp.length !== 5) {
      setError("Please enter the 5-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(email, otp);

      navigate("/login", {
        state: {
          message: "Email verified successfully. You can now login.",
        },
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center px-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{ maxWidth: "450px", width: "100%" }}
      >
        <div className="card-body p-4 p-md-5 text-center">
          {/* Icon */}
          <div
            className="bg-dark bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: "75px", height: "75px" }}
          >
            <span className="fs-1">✉️</span>
          </div>

          {/* Heading */}
          <h2 className="fw-bold mb-2">Verify your email</h2>

          <p className="text-secondary mb-1">
            We've sent a verification code to
          </p>

          <p className="fw-semibold text-dark mb-4">
            {email || "your email address"}
          </p>

          {/* OTP Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                autoComplete="one-time-code"
                className={`form-control form-control-lg text-center  ${
                  error ? "is-invalid" : ""
                }`}
                placeholder="Enter 5-digit OTP"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  setOtp(value);
                  setError("");
                }}
                style={{
                  letterSpacing: "10px",
                  fontSize: "12px",
                }}
              />

              {error && (
                <div className="invalid-feedback text-start">
                  {error}
                </div>
              )}
            </div>

            {/* Verify button */}
            <button
              type="submit"
              className="btn btn-dark btn-lg w-100 rounded-3 fw-semibold"
              disabled={loading || otp.length !== 5}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </button>
          </form>

          {/* OTP information */}
          <div className="mt-4">
            <p className="text-secondary small mb-1">
              Didn't receive the code?
            </p>

            <button
              type="button"
              className="btn btn-link text-decoration-none p-0 fw-semibold"
            >
              Resend OTP
            </button>
          </div>

          <hr className="my-4" />

          <button
            type="button"
            className="btn btn-link text-secondary text-decoration-none"
            onClick={() => navigate("/register")}
          >
            ← Back to registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpForm;