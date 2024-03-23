import { useEffect, useState } from "react";
import { useToken } from "../customHooks/useToken";
import RecipeView from "../components/recipeView";
import { getMyRecipes } from "../api/recipeApi";
import "../Styles/RecipeViewPage.css";

const MyRecipes = () => {
    const [token] = useToken();
    const [recipes, setRecipes] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMyRecipes(token);
                if (!Array.isArray(response)) throw new Error();
                setRecipes(response);
                setErrorMessage("");
            } catch (error) {
                setErrorMessage("Error loading recipes");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [token]);

    if (loading) return <p>Loading...</p>

    if (!loading && errorMessage) return <p>{errorMessage}</p>

    return (
        <div>
            <h1 className="pageheader">My Recipes:</h1>
            <div className="recipeViewContainer">
                {
                    recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <RecipeView key={recipe.id} recipe={recipe} />
                    )))
                    : <div>No recipes found.</div>
                }
            </div>
        </div>
    );
}

export default MyRecipes;