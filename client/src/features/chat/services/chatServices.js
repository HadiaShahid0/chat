export const getAllUsers = async () => {
  const response = await fetch(
    "http://localhost:5000/api/users",
    {
      credentials: "include",
    },
  );

  return response.json();
};


export const getMessages = async (
  userId,
) => {
  const response = await fetch(
    `http://localhost:5000/api/messages/${userId}`,
    {
      credentials: "include",
    },
  );

  return response.json();
};