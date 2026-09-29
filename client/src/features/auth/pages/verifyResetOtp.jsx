import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiLock,
} from "react-icons/fi";
import { verifyResetOtp } from "../services/authServices";

const VerifyResetOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return alert("Email information is missing.");
    }

    if (otp.length !== 6) {
      return alert("Please enter the 6-digit OTP.");
    }

    try {
      setLoading(true);

      const result = await verifyResetOtp(email, otp);

      navigate("/reset-password", {
        state: {
          resetToken: result.resetToken,
        },
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <h4 className="fw-bold">Invalid Request</h4>

          <p className="text-muted">
            Your password reset session is missing.
          </p>

          <Link
            to="/forgot-password"
            className="btn btn-dark"
          >
            Request New OTP
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div
        className="card border-0 shadow-lg rounded-4"
        style={{ width: "450px", maxWidth: "100%" }}
      >
        <div className="card-body p-4 p-md-5">
          {/* Icon */}
          <div className="text-center mb-4">
            <div
              className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center"
              style={{ width: "70px", height: "70px" }}
            >
              <FiLock size={32} className="bg-secondary text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">
              Verify Your Email
            </h2>

            <p className="text-muted mb-1">
              We've sent a 6-digit verification code to
            </p>

            <p className="fw-semibold text-dark mb-0">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* OTP */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="form-control text-center fw-bold"
                style={{
                  fontSize: "24px",
                  letterSpacing: "8px",
                }}
                placeholder="000000"
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                disabled={loading}
              />

              <small className="text-muted d-block text-center mt-2">
                Enter the 6-digit code from your email.
              </small>
            </div>

            {/* Verify */}
            <button
              type="submit"
              className="btn btn-dark w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />

                  Verifying...
                </>
              ) : (
                <>
                  <FiCheckCircle className="me-2" />

                  Verify OTP
                </>
              )}
            </button>
          </form>

          {/* Back */}
          <div className="text-center mt-4">
            <Link
              to="/forgot-password"
              className="text-decoration-none text-dark fw-semibold"
            >
              <FiArrowLeft className="me-1" />

              Change email
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtp;