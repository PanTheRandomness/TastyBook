const BASE_URL = "http://localhost:3004";

export const addToFavourites = async (recipeId, token) => {
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

export const deleteFavourite = async (favoriteId, token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/favourite/${favoriteId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete favorite');
        }
    } catch (error) {
        throw error;
    }
};

export const getFavourites = async (token) => {
    try {
        const response = await fetch(`${BASE_URL}/api/favourite`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return [];
            } else {
                throw new Error('Failed to fetch favorites');
            }
        }

        return response.json();
    } catch (error) {
        throw error;
    }
};
