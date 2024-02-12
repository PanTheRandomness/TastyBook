import { NavLink } from "react-router-dom";
import "../Styles/RecipeView.css";

const RecipeView = (props) => {
    const { recipe } = props;
    return (
        <NavLink className={"recipeView"} to={`/recipe/${recipe.hash}`}>
            <h3>{recipe.header}</h3>
            <div>By: {recipe.username}</div>
        </NavLink>
    );
}

export default RecipeView;