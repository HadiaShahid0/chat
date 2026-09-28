import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

import {
  BsCameraFill,
  BsShieldLockFill,
  BsPersonFill,
  BsEnvelopeFill,
  BsCheckCircleFill,
} from "react-icons/bs";

import {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
} from "../services/profileServices";

import { disableMfa } from "../../auth/services/authServices";

const Profile = () => {
  const { currentUser } = useOutletContext();
  const navigate = useNavigate();

  const [user, setUser] = useState(currentUser);
  const [name, setName] = useState(currentUser?.name || "");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(currentUser);
    setName(currentUser.name);

    setPreviewImage(
      currentUser.profileImage
        ? `http://localhost:5000/${currentUser.profileImage}?t=${Date.now()}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
            currentUser.name,
          )}&background=0D6EFD&color=fff&size=200`,
    );
  }, [currentUser]);

  const loadUser = async () => {
    try {
      const response = await getCurrentUser();

      if (response.success) {
        setUser(response.user);
        setName(response.user.name);

        setPreviewImage(
          response.user.profileImage
            ? `http://localhost:5000/${response.user.profileImage}?t=${Date.now()}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                response.user.name,
              )}&background=0D6EFD&color=fff&size=200`,
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDisableMfa = async () => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable two-factor authentication?",
    );

    if (!confirmDisable) return;

    try {
      setLoading(true);

      await disableMfa();

      await loadUser();

      alert("MFA disabled successfully.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaToggle = () => {
    if (user.mfaEnabled) {
      handleDisableMfa();
    } else {
      navigate("/mfa-setup");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      if (name !== user.name) {
        await updateProfile(name);
      }

      if (selectedImage) {
        await uploadProfileImage(selectedImage);
      }

      await loadUser();

      setSelectedImage(null);

      alert("Profile updated successfully.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border spinner-border-sm text-secondary"></div>
      </div>
    );
  }

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          {/* Main Card */}
          <div className="card border-0 shadow rounded-4 overflow-hidden">
            {/* ================= HEADER ================= */}
            <div className="bg-dark text-white px-4 py-3">
              <div className="d-flex align-items-center gap-3">
                {/* Profile Image */}
                <div className="position-relative flex-shrink-0">
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="rounded-circle shadow"
                    style={{
                      width: "85px",
                      height: "85px",
                      objectFit: "cover",
                      border: "3px solid white",
                    }}
                  />

                  {/* Camera */}
                  <label
                    className="btn btn-success rounded-circle position-absolute d-flex justify-content-center align-items-center p-0"
                    style={{
                      width: "30px",
                      height: "30px",
                      bottom: "-2px",
                      right: "-2px",
                      cursor: "pointer",
                    }}
                  >
                    <BsCameraFill size={13} />

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>

                {/* User Info */}
                <div className="min-width-0">
                  <h5 className="fw-bold mb-1">{user.name}</h5>

                  <div className="d-flex align-items-center gap-2 text-white-50">
                    <BsEnvelopeFill size={12} />
                    <span className=" text-truncate">{user.email}</span>
                  </div>

                  <div className="mt-2">
                    {user.mfaEnabled ? (
                      <span className="badge bg-success rounded-pill px-2 py-1">
                        <BsCheckCircleFill size={10} className="me-1" />
                        MFA Protected
                      </span>
                    ) : (
                      <span className="badge bg-secondary rounded-pill px-2 py-1">
                        MFA Disabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= BODY ================= */}
            <div className="card-body px-4 py-3">
              {/* Profile Information */}
              <div className="mb-3">
                <h6 className="fw-bold mb-1">Profile Information</h6>

                <p className="text-muted  mb-0">
                  Update your personal information and account details.
                </p>
              </div>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label  fw-semibold mb-1">
                  Full Name
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 py-2">
                    <BsPersonFill className="text-secondary" size={14} />
                  </span>

                  <input
                    type="text"
                    className="form-control form-control-sm bg-light border-start-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label  fw-semibold mb-1">
                  Email Address
                </label>

                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 py-2">
                    <BsEnvelopeFill className="text-secondary" size={14} />
                  </span>

                  <input
                    type="email"
                    className="form-control form-control-sm bg-light border-start-0"
                    value={user.email}
                    disabled
                  />
                </div>

                <div className="text-muted mt-1" style={{ fontSize: "11px" }}>
                  Your email address cannot be changed.
                </div>
              </div>
              {/* Save Button */}
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-dark btn-sm px-4 rounded-3"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
              <hr className="my-3" />

              {/* Security */}
              <div className="mb-3">
                <h6 className="fw-bold mb-1">Security</h6>

                <p className="text-muted  mb-0">
                  Manage your account security settings.
                </p>
              </div>

              {/* ================= MFA CARD ================= */}
              <div
                className={`border rounded-3 p-3 ${
                  user.mfaEnabled ? "border-success" : "border-secondary-subtle"
                }`}
                style={{
                  backgroundColor: user.mfaEnabled ? "#f5fff7" : "#f8f9fa",
                }}
              >
                <div className="d-flex align-items-center justify-content-between gap-3">
                  {/* MFA Info */}
                  <div className="d-flex align-items-center gap-3">
                    {/* Icon */}
                    <div
                      className={`rounded-3 d-flex justify-content-center align-items-center flex-shrink-0 ${
                        user.mfaEnabled ? "bg-success" : "bg-secondary"
                      }`}
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    >
                      <BsShieldLockFill size={19} color="white" />
                    </div>

                    {/* Text */}
                    <div>
                      <h6 className="fw-bold mb-1">
                        Two-Factor Authentication
                      </h6>

                      <p
                        className="text-muted mb-1"
                        style={{ fontSize: "12px" }}
                      >
                        Protect your account with an authenticator app.
                      </p>

                      <div className="d-flex align-items-center gap-1">
                        <span
                          className={`rounded-circle ${
                            user.mfaEnabled ? "bg-success" : "bg-secondary"
                          }`}
                          style={{
                            width: "6px",
                            height: "6px",
                          }}
                        />

                        <span
                          className={`fw-semibold ${
                            user.mfaEnabled ? "text-success" : "text-secondary"
                          }`}
                          style={{ fontSize: "11px" }}
                        >
                          {user.mfaEnabled
                            ? "Your account is protected"
                            : "MFA is currently disabled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Toggle */}
                  <div className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="mfaToggle"
                      checked={user.mfaEnabled}
                      onChange={handleMfaToggle}
                      disabled={loading}
                      style={{
                        width: "2.5rem",
                        height: "1.3rem",
                        cursor: loading ? "not-allowed" : "pointer",
                      }}
                    />
                  </div>
                </div>

                {/* MFA Status */}
                <div className="border-top mt-3 pt-2">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <div className="text-muted" style={{ fontSize: "11px" }}>
                        Authentication Method
                      </div>

                      <div className="fw-semibold" style={{ fontSize: "12px" }}>
                        {user.mfaEnabled
                          ? "Authenticator App"
                          : "Password only"}
                      </div>
                    </div>

                    <div className="col-6 text-end">
                      <span
                        className={`badge rounded-pill px-2 py-1 ${
                          user.mfaEnabled ? "bg-success" : "bg-secondary"
                        }`}
                        style={{ fontSize: "10px" }}
                      >
                        {user.mfaEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
