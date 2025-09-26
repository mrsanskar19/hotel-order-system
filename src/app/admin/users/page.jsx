"use client";

const UsersPage = () => {
  // Placeholder for users data
  const users = [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>
      <div className="bg-white p-4 rounded-lg shadow">
        {users.length > 0 ? (
          <ul>
            {users.map((user) => (
              <li key={user.id} className="border-b last:border-b-0 py-2">
                {/* Display user details here */}
                <p>{user.name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
