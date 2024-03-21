import React, { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { getAllUsers, deleteUser } from "../api/adminApi";
import '../Styles/Admin.css';
import { useUser } from '../customHooks/useUser';
import NotFound from './NotFoundPage';

const Admin = () => {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [token] = useToken();
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers(token);
        setUsers(response);
      } catch (error) {
        setError("Error fetching user data.");
      }
    };
  
    fetchUsers();
  }, [token]); 

  const handleDeleteUser = (userId) => {
    const currentUser = users.find(user => user.id === userId);
    if (currentUser && currentUser.admin) {
      setError("Admins cannot remove admins");
    } else {
      setShowConfirmationModal(true);
      setUserIdToDelete(userId);
    }
  };
  
  const confirmDeletion = async (confirmed) => {
    if (confirmed) {
      try {
        await deleteUser(userIdToDelete, token);
        setUsers(users.filter(user => user.id !== userIdToDelete));
        setShowConfirmationModal(false);
      } catch (error) {
        setError("Error deleting user");        
      }
    } else {
      setShowConfirmationModal(false);
    }
  };

  if (user && user.role !== "admin") return <NotFound />

  return (
    <div className="adminContainer">
      <h2>Admin Page</h2>
      {error && <div className="error-message">{error}</div>}
      <div className="adminHead">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Admin</th> 
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} data-testid={`user-${user.id}`}>
                <td className="cell-one">{user.id}</td>
                <td className="cell-two">{user.name}</td>
                <td className="cell-three">{user.username}</td>
                <td className="cell-four">{user.email}</td>
                <td className="cell-five">{user.admin ? 1 : null }</td> 
                <td className="cell-six">
                  <button onClick={() => handleDeleteUser(user.id)} className='adminButton'>Delete</button>
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
