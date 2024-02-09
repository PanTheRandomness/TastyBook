const BASE_URL = "http://localhost:3004";

export const getAllUsers = async (token) => {
    try {
        let response = await fetch(`${BASE_URL}/api/admin/users`, {
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
        let response = await fetch(`${BASE_URL}/api/admin/users/${userId}`, {
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
