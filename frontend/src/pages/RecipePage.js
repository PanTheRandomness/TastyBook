import { useState } from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
//Uniikit URL:it
//poistopainike + varmistus(window.confirm())

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
    const [keywords, setKeywords] = useState(["Eka sana", "Toka sana", "Kolmas sana"]);

    return(
        <div>
            <div>Yläosa</div>
            <div className='recipe-container'>
                <RecipeHead keywords={keywords}/>
                <div className='recipe-foot'>
                    <div className='recipe'>
                        <RecipeIngredients ingredients={ingredients}/>
                        <RecipeSteps steps={steps} page="recipepage"/>
                    </div>
                    <RecipeReviews reviews={reviews}/>
                </div>
            </div>
        </div>
    );
}

const RecipeHead = (props) =>{
    return(
        <div className='recipe-head'>
            <h1>Name</h1>
            <p>Description</p>
            <div>kuva sivummalle</div>
            <p>Creator <i>Created</i></p>
            <div>Star-rating, duration h, min</div>
            <RecipeKeywords keywords={props.keywords}/> <br/>
        </div>
    );
}

const RecipeKeywords = (props) =>{
    const words = props.keywords.map((w, i)=>{
        return <li key={i}>{w}</li>
    });

    return(
        <ul className='keywords'>
            {words}
        </ul>
    );
}

const RecipeIngredients = (props)=>{

    //Muotoilu ja asettelu!

    const ingredientList = props.ingredients.map((ing,i) =>{
        return <tr key={i}><th>{ing.quantity} {ing.unit}</th><td>{ing.ingredient}</td></tr>
    });

    return(
        <table className='recipe-ingredients'>
            <tbody>{ingredientList}</tbody>
        </table>
    );
}

const RecipeSteps = (props) =>{
    let page = props.page;
    const steps = props.steps.map((step, i) =>{
        return <li key={i}>{step}</li>
    });

    return(
        <div className='recipe-steps'>
            <ol className={page == "recipeform" ? "recipeform-step": "recipepage-step"}>{steps}</ol>
        </div>
    );
}

const RecipeReviews = (props) =>{
    //HUOM! Mieti asettelu!
    const reviews = props.reviews.map((r, i) =>{
        return <tr key={i}><th>{r.rating}</th><td>{r.username}:</td><td><i>{r.text}</i></td></tr>
    });

    return(
        <table className='recipe-reviews'>
            <tbody>{reviews}</tbody>
        </table>
    );
}

export  {Recipe, RecipeHead, RecipeIngredients, RecipeSteps, RecipeReviews};