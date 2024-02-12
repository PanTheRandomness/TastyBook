import React, { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { getAllUsers, deleteUser } from "../api/adminApi";
import '../Styles/Admin.css';
const BASE_URL = "http://localhost:3004";


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [token,] = useToken();
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState(null);

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


  const confirmDeletion = async () => {
    try {
      const response = await deleteUser(token);
      setUsers(response);
    } catch (error) {
      console.error('Error fetching user data', error);
      setError('Error fetching user data');
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
                <td class="cell-one">{user.id}</td>
                <td class="cell-two">{user.username}</td>
                <td class="cell-three">{user.email}</td>
                <td class="cell-four">
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
          <button className='adminButton' onClick={() => confirmDeletion(true)}>Yes</button>
          <button className='adminButton' onClick={() => confirmDeletion(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
