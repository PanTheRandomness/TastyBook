import { useState, useEffect } from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
//Uniikit URL:it
//poistopainike + varmistus(window.confirm())

const Recipe = (props) =>{
    const { route } = props;
    //esimerkkiresepti kehitystä varten, poista tiedot kun reseptejä voidaan tarkkailla
    const [recipe, setRecipe] = useState({
        "header" : "Reseptin nimi",
        "description" : "Nami nami ruokaa",
        "visibleToAll" : true,
        "creator" : "Joku Heppu",
        "created" : '1-1-2024',
        "rating" : 5,
        "durationHours" : 2,
        "durationMinutes" : 15,
        "ingredients" : [
            {"quantity": "1 dl", "ingredient":"flour"}, 
            {"quantity": "2 tsp", "ingredient":"salt"},
            {"quantity": "1 tbsp", "ingredient":"pepper"}
        ],
        "steps" : ["Eka kohta", "Toka kohta", "Kolmas kohta", "jne"],
        "keywords" : ["Eka sana", "Toka sana", "Kolmas sana"], 
        "reviews" : [
            {"username":"joku", "rating":"5/5", "text":"Oli kyllä mainio!"},
            {"username":"t", "rating":"2/5", "text":"Liian helppo :("},
            {"username":"möh", "rating":"4/5", "text":"Maukas"}
        ]
    });

    useEffect(()=>{
        const getRecipe = async () =>{
            try {
                const response = await fetch("http://localhost:3004/api/recipe/" + route);
                let r = await response.json();
                setRecipe(r);
            } catch (error) {
                // TODO: handle error
            }
        }
        getRecipe();
    },[]);

    return(
        <div>
            <div className='recipe-container'>
                <RecipeHead recipe={recipe}/>
                <div className='recipe-foot'>
                    <div className='recipe'>
                        <RecipeIngredients ingredients={recipe.ingredients}/>
                        <RecipeSteps steps={recipe.steps} page="recipepage"/>
                    </div>
                    {/*<RecipeReviews reviews={recipe.reviews}/>*/}
                </div>
            </div>
        </div>
    );
}

const RecipeHead = (props) =>{
    const recipe = props.recipe;
    return(
        <div className='recipe-head'>
            <h1>{recipe.header} <img src='rating_star.png' alt="Star Rating"/>{recipe.rating}</h1>
            <p>{recipe.description}</p>
            <div>kuva sivummalle</div>
            <p>{recipe.creator} <i>{recipe.created}</i></p>
            <div><i>Duration: </i>{recipe.durationHours}h {recipe.durationMinutes}min</div>
            <RecipeKeywords keywords={recipe.keywords}/> <br/>
        </div>
    );
}

const RecipeKeywords = (props) =>{
    const words = props.keywords.map((w, i)=>{
        return <li key={i}><a>{w.word}</a></li>
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
        return <li key={i}>{step.step} </li>
    });

    return(
        <div className='recipe-steps'>
            <ol className={page == "recipeform" ? "recipeform-step": "recipepage-step"}>{steps}</ol>
        </div>
    );
}
/*
const RecipeReviews = (props) =>{
    //HUOM! Mieti asettelu!
    const reviews = props.reviews.map((r, i) =>{
        return <tr key={i}><th>{r.rating}</th><td>{r.username}:</td><td><i>{r.text}</i></td></tr>
    });

    //nappi ohjaa kirjautumaan, jos ei vielä ole
    return(
        <table className='recipe-reviews'>
            <tbody>
                {props.reviews.length > 0 ? reviews : <tr><td><i className='review-placeholder'>No reviews have been posted yet.</i></td></tr>}
                <tr> 
                    <td>
                        <button className='review-button'>Add review</button>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
*/
export  {Recipe, RecipeHead, RecipeIngredients, RecipeSteps };