import { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { useUser } from '../customHooks/useUser';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import '../Styles/Ellipsis.css';
import { useNavigate } from 'react-router-dom';
import EllipsisMenu from '../components/EllipsisMenu';
import ErrorModal  from '../components/ErrorModal';
import { fetchRecipe, removeRecipe } from '../api/recipeApi';

const Recipe = (props) =>{
    const { route } = props;
    const [token] = useToken();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const openDeleteModal = () => setDeleteModalOpen(true);
    const closeDeleteModal = () => setDeleteModalOpen(false);

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const openErrorModal = () => setErrorModalOpen(true);
    const closeErrorModal = () => {setErrorModalOpen(false); setErrorText('');}
    
    const [recipe, setRecipe] = useState({
        "header" : "",
        "description" : "",
        "visibleToAll" : true,
        "creator" : "",
        "rating" : 0,
        "durationHours" : 0,
        "durationMinutes" : 0,
        "ingredients" : [],
        "steps" : [],
        "keywords" : [], 
        "reviews" : []
    });

    useEffect(()=>{
        const getRecipe = async () =>{
            try {
                const response = await fetchRecipe(token, route);
                setRecipe(response);

            } catch (error) {
                setErrorText("An error occurred while loading recipe: " + error);
                openErrorModal();
            }
        }
        getRecipe();
    },[route]);

    const deleteRecipe = async () =>{
        try {
            console.log("Starting deletion...");
            closeDeleteModal();
            const response = await removeRecipe(token, route);
            if(response.ok){
                console.log("Recipe deleted successfully.");
                navigate("/");
            }

        } catch (error) {
            setErrorText("An error occurred while loading recipe: " + error);
            openErrorModal();
        }
    }

    return(
        <div>
            <div className='recipe-container'>
                <RecipeHead recipe={recipe} onDelete={openDeleteModal} route={route}/>
                <div className='recipe-foot'>
                    <div className='recipe'>
                        <RecipeIngredients ingredients={recipe.ingredients} page="recipepage"/>
                        <RecipeSteps steps={recipe.steps}/>
                    </div>
                    {/*<RecipeReviews reviews={recipe.reviews}/>*/}
                </div>
            </div>
            {isDeleteModalOpen ? <DeleteDialog isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={deleteRecipe}/>:null}
            {isErrorModalOpen ? <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errortext={errorText} /> : null}
        </div>
    );
}

const RecipeHead = (props) =>{
    const recipe = props.recipe;
    const createdFormatted = new Date(props.recipe.created).toLocaleDateString('fi-FI');
    
    const calculateAvgRating = () =>{
        //TODO: keskiarvon laskeminen
    }

    return(
        <div className='recipe-head'>
            <div>
                <h1>{recipe.header} {/*<img src='rating_star.png' alt="Star Rating"/>{recipe.rating}*/}</h1>
                <EllipsisMenu onDelete={props.onDelete} creator={recipe.username} route={props.route} />
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

const DeleteDialog = ({ isOpen, onClose, onConfirm}) =>{
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`} data-testid={"delete-dialog"}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-header'>Do you want to delete this recipe?</h2>
                <p className='modal-text'>Are you certain you want to delete this recipe? Deletion cannot be undone.</p>
                <button onClick={() => onConfirm()} data-testid='confirm-button'>Confirm</button>
                <button onClick={() => onClose()} data-testid='cancele-button'>Cancel</button>
            </div>
        </div>
    );
}

export { Recipe, RecipeHead, RecipeIngredients, RecipeSteps, DeleteDialog };