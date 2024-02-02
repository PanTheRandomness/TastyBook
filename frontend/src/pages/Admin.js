import React, { useState, useEffect } from 'react';
import '../Styles/Modal.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');  //Lisää tänne http jutut
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching user data', error);
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
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
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
