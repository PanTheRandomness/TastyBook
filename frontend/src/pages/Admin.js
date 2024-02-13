import React, { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { getAllUsers, deleteUser,updateUser } from "../api/adminApi";
import '../Styles/Admin.css';


const Admin = () => {
  const [users, setUsers] = useState([]);
  const [token,] = useToken();
  const [userIdToDelete, setUserIdToDelete] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedUsername, setEditedUsername] = useState('');
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
  }, [token]); 

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedName(user.name);
    setEditedUsername(user.username);
    setEditedEmail(user.email);
  };

  const handleDeleteUser = (userId) => {
    setShowConfirmationModal(true);
    setUserIdToDelete(userId);
  };

  const confirmDeletion = async (confirmed) => {
    if (confirmed) {
      try {
        await deleteUser(userIdToDelete, token);
        setUsers(users.filter(user => user.id !== userIdToDelete));
        setShowConfirmationModal(false);
      } catch (error) {
        console.error('Error deleting user', error);
        setError('Error deleting user');
      }
    } else {
      setShowConfirmationModal(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateUser(editingUser.id, { username: editedUsername, name: editedName, email: editedEmail }, token);
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, username: editedUsername, name: editedName, email: editedEmail } : user));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user', error);
      setError('Error updating user');
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
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="cell-one">{user.id}</td>
                <td className="cell-two">{editingUser && editingUser.id === user.id ? <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} /> : user.name}</td>
                <td className="cell-three">{editingUser && editingUser.id === user.id ? <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} /> : user.username}</td>
                <td className="cell-four">{editingUser && editingUser.id === user.id ? <input type="email" value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} /> : user.email}</td>
                <td className="cell-five">
                  {editingUser && editingUser.id === user.id ? (
                    <>
                      <button onClick={() => handleSaveEdit()}>Save</button>
                      <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditUser(user)}>Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </>
                  )}
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
