const BASE_URL = "http://localhost:3004";

export const getAllUsers = async (token) => {
    try {
        let response = await fetch(`${BASE_URL}/api/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (userId, token) => {
    try {
        let response = await fetch(`${BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete user');
        }
        return;
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (userId, userData, token) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  }