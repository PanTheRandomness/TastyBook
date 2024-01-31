import { useState, useEffect } from 'react';
//Uniikit URL:it
//poistopainike + varmistus

const Recipe = () =>{
    
    const [created, setCreated] = useState('');
    const [modified, setModified] = useState('');
    const [creator, setCreator] = useState('');

    //esimerkkilistoja kehitystä varten
    const [ingredients, setIngredients] = useState([
        {"quantity": "1 dl", "ingredient":"flour"}, 
        {"quantity": "2 tsp", "ingredient":"salt"},
        {"quantity": "1 tbsp", "ingredient":"pepper"}
    ]);
    const [steps, setSteps] = useState(["Eka kohta", "Toka kohta", "Kolmas kohta", "jne"]);
    const [reviews, setReviews] = useState([
        {"username":"joku", "rating":"5/5", "text":"Oli kyllä mainio!"},
        {"username":"t", "rating":"2/5", "text":"Liian helppo :("},
        {"username":"möh", "rating":"4/4", "text":"Maukas"}
    ]);

    return(
        <div className='RecipeContainer'>
            <RecipeHead />
            <h2>Ingredients:</h2>
            <RecipeIngredients ingredients={ingredients}/>
            <RecipeSteps steps={steps}/>
            <RecipeReviews reviews={reviews}/>
        </div>
    );
}

//Palauttaa muotoillun 
const RecipeHead = (props) =>{
    //HUOM! Asettelu gridiin keskelle!
    return(
        <div>
            <h1>Name</h1>
            <p>Description</p>
            <div>kuva sivummalle</div>
            <p>Creator <i>Created</i></p>
            <div>Star-rating, duration h, min</div>
            <div>Keywords_list</div> <br/>
        </div>
    );
}

const RecipeIngredients = (props)=>{

    //Muotoilu ja asettelu!

    const ingredientList = props.ingredients.map((ing,i) =>{
        return <tr key={i}><th>{ing.quantity} {ing.unit}</th><td>{ing.ingredient}</td></tr>
    });

    return(
        <table>
            <tbody>{ingredientList}</tbody>
        </table>
    );
}

const RecipeSteps = (props) =>{
    const steps = props.steps.map((step, i) =>{
        return <li key={i}>{step}</li>
    });

    return(
        <div>
            <ol>{steps}</ol>
        </div>
    );
}

const RecipeReviews = (props) =>{
    //HUOM! Mieti asettelu!
    const reviews = props.reviews.map((r, i) =>{
        return <tr key={i}><th>{r.rating}</th><td>{r.username}:</td><td><i>{r.text}</i></td></tr>
    });

    return(
        <table>
            <tbody>{reviews}</tbody>
        </table>
    );
}

export  {Recipe, RecipeHead, RecipeIngredients, RecipeSteps, RecipeReviews};