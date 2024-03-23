import { NavLink } from "react-router-dom";
import "../Styles/RecipeView.css";
import { useEffect, useState } from "react";
import { fetchRecipeImage } from "../api/recipeApi";
import { useToken } from "../customHooks/useToken";

const RecipeView = (props) => {
    const { recipe } = props;
    const [token] = useToken();
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetchRecipeImage(token, recipe.hash);
                setImage(response);
            } catch (error) {

            }
        }

        fetchImage();
    }, []);
    return (
        <NavLink className={"recipeView"} to={`/recipe/${recipe.hash}`}>
            <div>
                <h3>{recipe.header}</h3>
                {recipe.username ? <div>By: {recipe.username}</div> :
                    <div>By: Deleted user</div>}
            </div>
            {/*<img src='/rating_star.png' alt="Star Rating"/>*/}{/*Arvosanan KA tähän */}
            <div className="image-container">
                {image && <img src={URL.createObjectURL(image)} alt="Recipe Image" className="recipeimage" />}
            </div>
        </NavLink>
    );
}

export default RecipeView;