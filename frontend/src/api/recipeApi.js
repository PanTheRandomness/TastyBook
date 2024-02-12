const BASE_URL = "http://localhost:3004";

export const getRecipeRoutes = async (token) => {
    try {
        let response;
        if (token) {
            response = await fetch(`${BASE_URL}/api/recipe/urls`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
        else response = await fetch(`${BASE_URL}/api/recipe/urls`);
        return response.json();
    } catch (error) {
        throw error;
    }
}

export const getRecipeViews = async (token) => {
    try {
        let response;
        if (token) {
            response = await fetch(`${BASE_URL}/api/recipes`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
        }
        else response = await fetch(`${BASE_URL}/api/recipes`);
        return response.json();
    } catch (error) {
        throw error;
    }
}