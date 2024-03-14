import { useEffect, useState } from "react";
import { getRecipeViews } from "../api/recipeApi";
import { useToken } from "../customHooks/useToken";
import RecipeView from "../components/recipeView";
import "../Styles/Frontpage.css";

const FrontPage = ({ onLogout }) => {
    const [token,] = useToken();
    const [recipes, setRecipes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getRecipeViews(token);
                if (!Array.isArray(response.recipes)) throw new Error();
                setRecipes(response.recipes);
                setErrorMessage("");
                if (!response.loggedIn) onLogout();
            } catch (error) {
                setErrorMessage("Error loading recipes ");
            } finally {
                setLoading(false);
            }
        }
        
        fetchData();
    }, []);

    if (!loading && errorMessage) return <p>{errorMessage}</p>

    return (
        <div>
            <h1 className="frontpageheader">Tasty Book Recipes:</h1>
            {/*SearchBar tähän */}
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