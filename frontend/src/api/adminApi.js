const BASE_URL = "http://localhost:3004";

export const getAllUsers = async (token) => {
    try {
        let response;
        if (token){
            response = await fetch(`${BASE_URL}/api/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    }
        else response = await fetch(`${BASE_URL}/api/users`);
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const deleteUser = async (userId, token) => {
    try {
        let response = await fetch(`${BASE_URL}/api/users/:userId${userId}`, {
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
