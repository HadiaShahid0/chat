import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
} from "react-icons/fi";
import { resetPassword } from "../services/authServices";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken = location.state?.resetToken;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim()) {
      return alert("New password is required.");
    }

    if (newPassword.length < 6) {
      return alert(
        "Password must be at least 6 characters."
      );
    }

    if (!confirmPassword.trim()) {
      return alert("Please confirm your password.");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    if (!resetToken) {
      return alert(
        "Password reset session has expired. Please try again."
      );
    }

    try {
      setLoading(true);

      await resetPassword(
        resetToken,
        newPassword
      );

      alert("Password reset successfully.");

      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div className="text-center">
          <div className="mb-3">
            <FiLock size={45} className="bg-secondary text-white" />
          </div>

          <h4 className="fw-bold">
            Reset Session Expired
          </h4>

          <p className="text-muted">
            Please request a new password reset code.
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
              Create New Password
            </h2>

            <p className="text-muted mb-0">
              Your new password must be different from
              your previous password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                New Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiLock />
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm Password
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiLock />
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            <div className="bg-light rounded-3 p-3 mb-4">
              <small className="text-muted">
                Password requirements:
              </small>

              <div className="small mt-2">
                <div
                  className={
                    newPassword.length >= 6
                      ? "text-success"
                      : "text-muted"
                  }
                >
                  <FiCheckCircle className="me-2" />
                  At least 6 characters
                </div>
              </div>
            </div>

            {/* Submit */}
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

                  Updating Password...
                </>
              ) : (
                <>
                  <FiCheckCircle className="me-2" />

                  Reset Password
                </>
              )}
            </button>
          </form>

          {/* Back */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-decoration-none text-dark fw-semibold"
            >
              <FiArrowLeft className="me-1" />

              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;