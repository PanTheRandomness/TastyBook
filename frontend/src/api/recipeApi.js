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

export const fetchRecipe = async (token, route) =>{
    try{
        if(token) {
            let response = await fetch(`${BASE_URL}/api/recipe/${route}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if(!response.ok){
                throw new Error('Recipe not found');
            }
            return response.json();
        }
    } catch (error){
        throw error;
    }
}

export const removeRecipe = async (token, route) =>{
    try{
        if(token){
            let response = await fetch(`${BASE_URL}/api/recipe/${route}`, {
                method:'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : "Bearer " + token
                }
            });

            return response.json();
        }
    } catch(error){
        throw error;
    }
}