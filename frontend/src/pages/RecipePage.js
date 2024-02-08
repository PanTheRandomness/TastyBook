import { useState, useEffect, useRef } from 'react';
import { useToken } from '../customHooks/useToken';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import '../Styles/Ellipsis.css';
//Uniikit URL:it
//poistopainike + varmistus(window.confirm())

const Recipe = (props) =>{
    const { route } = props;
    const [token,] = useToken();
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
                let r = await response.json();
                setRecipe(r);
            } catch (error) {
                // TODO: handle error
            }
        }
        getRecipe();
    },[]);

    //Ei toimi vielä, mikä puuttuu?
    const deleteRecipe = async () =>{
        //Onko headersit ok?
        const requestOptions = {
            method:'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : "Bearer " + token
            },
            body : {
                hash : route,
                userId : recipe.User_id
            }
        };

        try {
            console.log("Starting deletion...");
            const response = await fetch("http://localhost:3004/api/recipe", requestOptions);
            if(response.ok){
                console.log("Recipe deleted successfully.");
                //palaa etusivulle
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
    const [creator, setCreator] = useState({});
    const createdFormatted = new Date(props.recipe.created).toLocaleDateString('fi-FI');

    /*useEffect(()=>{
        const getCreator = async () =>{
            let id = recipe.User_id;
            const response = await fetch();
        }
        if(recipe != {}) getCreator();
    },[]);*/

    const calculateAvgRating = () =>{

    }

    return(
        <div className='recipe-head'>
            <div>
                <h1>{recipe.header} {/*<img src='rating_star.png' alt="Star Rating"/>{recipe.rating}*/}</h1>
                <EllipsisMenu onDelete={props.onDelete} onEdit={props.onEdit}/>
            </div>
            <p>{recipe.description}</p>
            <p> Created By:{creator.username} <br/> 
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
const EllipsisMenu = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    const toggleMenu = () => {
      setIsOpen(!isOpen);
    };

    //Alla olevat kaksi (ja useRef) mahdollistavat menun sulkemisen klikkaamalla sen ulkopuolelta!
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleEditClick = () => {
        console.log('Edit recipe selected...');
        setIsOpen(false);
        props.onEdit();
    };

    const handleDeleteClick = () => {
        setIsOpen(false);
        if(window.confirm("Are you sure you want to delete this recipe? Deletion cannot be undone.")){
            //JOS on reseptin omistaja:
            props.onDelete();
        }
    };
  
    return (
      <div className="ellipsis-menu">
        <div className="ellipsis" onClick={toggleMenu}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        {isOpen && (
          <div className="dropdown" ref={dropdownRef}>
            <ul>
              <li onClick={handleEditClick}>Edit recipe</li>
              <li onClick={handleDeleteClick} style={{color:'red'}}>Delete recipe</li>
            </ul>
          </div>
        )}
      </div>
    );
};

export  {Recipe, RecipeHead, RecipeIngredients, RecipeSteps, EllipsisMenu };