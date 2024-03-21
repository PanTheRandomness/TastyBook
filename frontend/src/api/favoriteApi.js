const BASE_URL = "http://localhost:3004";

export const addToFavorites = async (recipeId, token) => {
    try {
        const apiUrl = `${BASE_URL}/api/favourite`; 
        const requestData = {
            recipeId: recipeId
        };

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to add recipe to favorites');
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};
