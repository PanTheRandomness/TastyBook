import React, { useState } from 'react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {


    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users'); // lisää polku
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {

    try {
      await fetch(`/api/users/${userIdToDelete}`, {
        method: 'DELETE',
      });
      setUsers(users.filter(user => user.id !== userIdToDelete));
      setUserIdToDelete('');
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <form>
        <label>
          User ID for deletion:
          <input
            type="text"
            value={userIdToDelete}
            onChange={(e) => setUserIdToDelete(e.target.value)}
          />
        </label>
        <button type="button" onClick={handleDeleteUser}>
          Delete User
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => setUserIdToDelete(user.id)}>
                  Set for Deletion
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
