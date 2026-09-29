import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { forgotPassword } from "../services/authServices";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return alert("Email is required.");
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      navigate("/verify-reset-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

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
              <FiShield size={32} className="bg-secondary text-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2">Forgot Password?</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Email Address
              </label>

              <div className="input-group">
                <span className="input-group-text bg-white">
                  <FiMail />
                </span>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
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

                  Sending OTP...
                </>
              ) : (
                <>
                  <FiSend className="me-2" />

                  Send OTP
                </>
              )}
            </button>
          </form>

          {/* Back to Login */}
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

export default ForgotPassword;