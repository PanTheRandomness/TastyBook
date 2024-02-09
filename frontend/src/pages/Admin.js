import React, { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { getAllUsers } from "../api/adminApi";
import '../Styles/Admin.css';

const BASE_URL = "http://localhost:3004";


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState(null);
  const [token] = useToken(); 

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(token);
        setUsers(response); 
      } catch (error) {
        console.error('Error fetching user data', error);
        setError('Error fetching user data');
      }
    };
  
    fetchUsers();
  }, []); 

  const handleEditUser = (userId) => {
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
      const token = localStorage.getItem('token'); 
      await fetch(`${BASE_URL}/api/admin/users/${userIdToDelete}`, { 
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
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
