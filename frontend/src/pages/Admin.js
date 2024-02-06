import React, { useState, useEffect } from 'react';
import '../Styles/Admin.css';
const BASE_URL = "http://localhost:3004";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/local/api/users`,);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Error fetching user data');
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    // Lisää toiminnallisuus käyttäjän muokkaamiseen
    console.log(`Edit user with ID: ${userId}`);
  };

  const handleDeleteUser = (userId) => {
    setShowConfirmationModal(true);
    setUserIdToDelete(userId);
  };

  const confirmDeletion = async (confirmed) => {
    setShowConfirmationModal(false);

    if (!confirmed) {
      return;
    }

    try {
      await fetch(`/api/users/${userIdToDelete}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((user) => user.id !== userIdToDelete));
      setUserIdToDelete('');
    } catch (error) {
      console.error('Error deleting user', error);
      setError('Error deleting user');
    }
  };

  return (
    <div className="adminContainer">
      <h2>Admin Page</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="adminHead">
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => handleEditUser(user.id)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showConfirmationModal && (
        <div className="confirmation-modal">
          <p>Are you sure you want to delete this user?</p>
          <button onClick={() => confirmDeletion(true)}>Yes</button>
          <button onClick={() => confirmDeletion(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
