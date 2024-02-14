import { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import '../Styles/Ellipsis.css';
import { useNavigate } from 'react-router-dom';
import EllipsisMenu from '../components/EllipsisMenu';

// TODO: varmista oikeellinen näyttö tokenilla + visibleToAll-arvolla

const Recipe = (props) =>{
    const { route } = props;
    const [token,] = useToken();
    const navigate = useNavigate();
    
    //esimerkkiresepti kehitystä varten, poista tiedot kun reseptejä voidaan tarkkailla
    const [recipe, setRecipe] = useState({
        "header" : "Reseptin nimi",
        "description" : "Nami nami ruokaa",
        "visibleToAll" : true,
        "creator" : "Joku Heppu",
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
                if (response.ok) {
                    const r = await response.json();
                    setRecipe(r);
                } else {
                    throw new Error('Recipe not found');
                }
            } catch (error) {
                window.alert("An error occurred while loading recipe: " + error);
            }
        }
        getRecipe();
    },[route]);

    const deleteRecipe = async () =>{
        const requestOptions = {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : "Bearer " + token
            }
        };

        try {
            console.log("Starting deletion...");
            const response = await fetch("http://localhost:3004/api/recipe/" + route, requestOptions);
            if(response.ok){
                console.log("Recipe deleted successfully.");
                navigate("/");
            }
        } catch (error) {
            window.alert("Unable to post recipe: ", error);
        }
    }

    const editRecipe = async () =>{
        console.log("Starting edit...");
        //tästä takaisin lisäyssivulle, vie nyk. reseptin tiedot
    }

    return(
        <div>
            <div className='recipe-container'>
                <RecipeHead recipe={recipe} onDelete={deleteRecipe} onEdit={editRecipe}/>
                <div className='recipe-foot'>
                    <div className='recipe'>
                        <RecipeIngredients ingredients={recipe.ingredients} page="recipepage"/>
                        <RecipeSteps steps={recipe.steps}/>
                    </div>
                    {/*<RecipeReviews reviews={recipe.reviews}/>*/}
                </div>
            </div>
        </div>
    );
}

const RecipeHead = (props) =>{
    const recipe = props.recipe;
    const createdFormatted = new Date(props.recipe.created).toLocaleDateString('fi-FI');
    
    const calculateAvgRating = () =>{

    }

    return(
        <div className='recipe-head'>
            <div>
                <h1>{recipe.header} {/*<img src='rating_star.png' alt="Star Rating"/>{recipe.rating}*/}</h1>
                <EllipsisMenu onDelete={props.onDelete} onEdit={props.onEdit}/>
            </div>
            <p>{recipe.description}</p>
            <p> Created By: {recipe.username} <br/> 
                Creation date: {createdFormatted} <br/>
                <i>Duration: {recipe.durationHours}h {recipe.durationMinutes}min</i>
            </p>
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
    const ingredientList = props.ingredients.map((ing,i) =>{
        return <tr key={i}><th>{ing.quantity} {ing.unit}</th><td>{ing.name}</td></tr>
    });

    return(
        <table className='recipe-ingredients'>
            <tbody>{ingredientList}</tbody>
        </table>
    );
}

const RecipeSteps = (props) =>{
    const steps = props.steps.map((step, i) =>{
        return <li key={i}>{step.step} </li>
    });

    return(
        <div className='recipe-steps'>
            <ol className="recipepage-step">{steps}</ol>
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



export { Recipe, RecipeHead, RecipeIngredients, RecipeSteps };