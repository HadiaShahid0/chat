import UserItem from "./userItem";

const ChatSidebar = ({ users, selectedUser, onSelectUser }) => {
  return (
    <div className="border-end">
      {/* Sidebar Header */}
      <div className="p-3 border-bottom">
        <h5 className="mb-0">Users</h5>
      </div>

      {/* Users */}
      <div>
        {users.length === 0 ? (
          <p className="text-muted text-center p-3">No users found</p>
        ) : (
          users.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              selected={selectedUser?._id === user._id}
              onClick={() => onSelectUser(user)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
