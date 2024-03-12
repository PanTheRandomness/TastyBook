import { useState } from "react";
import '../Styles/Print.css';

const Print = (props) =>{
    const recipe = props.recipe;

    return(
        <div className='print-container'>
            <h1>{recipe.header}</h1>
            <p>{recipe.description}</p>
            <p>Created By: {recipe.username}</p>
            <p>Creation date: {new Date(recipe.created).toLocaleDateString('fi-FI')}</p>
            <p>Duration: {recipe.durationHours}h {recipe.durationMinutes}min</p>

            <h2>Ingredients:</h2>
            <ul>
                {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</li>
                ))}
            </ul>

            <h2>Steps:</h2>
            <ol>
                {recipe.steps.map((step, index) => (
                    <li key={index}>{step.step}</li>
                ))}
            </ol>

            <h2>Keywords:</h2>
            <ul>
                {recipe.keywords.map((keyword, index) => (
                    <li key={index}>{keyword.word}</li>
                ))}
            </ul>
            </div>
    );
};

export default Print;