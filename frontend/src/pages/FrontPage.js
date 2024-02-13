import { useEffect, useState } from "react";
import { getRecipeViews } from "../api/recipeApi";
import { useToken } from "../customHooks/useToken";
import RecipeView from "../components/recipeView";
import "../Styles/Frontpage.css";

const FrontPage = ({ onLogout }) => {
    const [token,] = useToken();
    const [recipes, setRecipes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRecipeViews(token);
                if (!Array.isArray(response.recipes)) throw new Error();
                setRecipes(response.recipes);
                if (!response.loggedIn) onLogout();
            } catch (error) {
                // TODO: show error
            }
        }
        
        fetchData();
    }, []);
    return (
        <div>
            <h1>Tasty Book Recipes:</h1>
            <div className="recipeViewContainer">
                {
                    recipes.map(recipe => (
                        <RecipeView key={recipe.id} recipe={recipe} />
                    ))
                }
            </div>
        </div>
    );
}

export default FrontPage;