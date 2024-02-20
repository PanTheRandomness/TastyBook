import { NavLink } from "react-router-dom";
import "../Styles/RecipeView.css";

const RecipeView = (props) => {
    const { recipe } = props;
    return (
        <NavLink className={"recipeView"} to={`/recipe/${recipe.hash}`}>
            <h3>{recipe.header}</h3>
            { recipe.username ? <div>By: {recipe.username}</div> :
            <div>By: Deleted user</div> }
        </NavLink>
    );
}

export default RecipeView;