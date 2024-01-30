import {useState, useEffect} from 'react';
//Uniikit URL:it
//poistopainike + varmistus
const Recipe = () =>{
    const [ingredients, setIngredients] = useState([
        {"quantity": "1 dl", "ingredient":"flour"}, 
        {"quantity": "2 tsp", "ingredient":"salt"},
        {"quantity": "1 tbsp", "ingredient":"pepper"}
        //esimerkkilista kehitystä varten
    ]);

    return(
        <div>
            <RecipeHead />
            <RecipeIngredients ingredients={ingredients}/>
            <RecipeSteps />
        </div>
    );
}

const RecipeHead = (props) =>{
    return(
        <div></div>
    );
}

const RecipeIngredients = (props)=>{

    const ingredientList = props.ingredients.map((ing,i) =>{
        return <tr key={i}><th>{ing.quantity}</th><td>{ing.ingredient}</td></tr>
    });

    return(
        <table>
            <caption>Ingredients</caption>
            {ingredientList}
        </table>
    );
}

const RecipeSteps = (props) =>{
    return(
        <div></div>
    );
}

export  {Recipe, RecipeHead, RecipeIngredients, RecipeSteps};