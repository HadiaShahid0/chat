import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllUsers } from "../services/chatServices";

const ChatUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();

      console.log("Users response:", data);

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.log("Users error:", error);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 p-4">
      <h2 className="fw-bold mb-4">All Users</h2>

      {users.length === 0 ? (
        <div className="alert alert-info">No users found.</div>
      ) : (
        <div className="row">
          {users.map((user) => (
            <div key={user._id} className="col-md-6 col-lg-4 mb-3">
              <div
                className="card shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/chat/${user._id}`)}
              >
                <div className="card-body d-flex align-items-center">
                  <img
                    src={
                      user.profileImage
                        ? `http://localhost:5000/${user.profileImage}`
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}`
                    }
                    alt={user.name}
                    className="rounded-circle"
                    style={{
                      width: "55px",
                      height: "55px",
                      objectFit: "cover",
                    }}
                  />

                  <div className="ms-3">
                    <h5 className="mb-1">{user.name}</h5>

                    <small className="text-muted">{user.email}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatUsers;
