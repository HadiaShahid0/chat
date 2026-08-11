const UserItem = ({ user, onClick }) => {
  return (
    <div
      className="d-flex align-items-center p-3 border-bottom user-item"
      style={{
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <img
        src={
          user?.profileImage
            ? `http://localhost:5000/${user.profileImage}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "User",
              )}&background=random`
        }
        alt={user.name}
        className="rounded-circle"
        style={{
          width: "50px",
          height: "50px",
          objectFit: "cover",
        }}
      />

      <div className="ms-3 flex-grow-1">
        <h6 className="mb-1 fw-semibold">{user.name}</h6>

        <small className="text-muted">{user.email}</small>
      </div>

      <i className="bi bi-chat-dots text-secondary fs-5"></i>
    </div>
  );
};

export default UserItem;
