import { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import { useUser } from '../customHooks/useUser';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import '../Styles/Ellipsis.css';
import { useNavigate } from 'react-router-dom';
import EllipsisMenu from '../components/EllipsisMenu';
import ErrorModal  from '../components/ErrorModal';
import { fetchRecipe, removeRecipe, removeRecipeAdmin } from '../api/recipeApi';
import Print from '../components/Print';

const Recipe = (props) =>{
    const { route } = props;
    const user = useUser();
    const [token] = useToken();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const openDeleteModal = () => setDeleteModalOpen(true);
    const closeDeleteModal = () => setDeleteModalOpen(false);
    const [image, setImage] = useState(null);

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const openErrorModal = () => setErrorModalOpen(true);
    const closeErrorModal = () => {setErrorModalOpen(false); setErrorText('');}

    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const openShareModal = () => setShareModalOpen(true);
    const closeShareModal = () => setShareModalOpen(false);
    
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
                // Onko reseptin id:llä kuvaa? jos on => setImage

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
            if(user.role === 'admin'){
                const response = await removeRecipeAdmin(token, route);
                if(response.ok){
                    console.log("Recipe deleted successfully.");
                    navigate("/");
                }
            }
            else{
                const response = await removeRecipe(token, route);
                if(response.ok){
                    console.log("Recipe deleted successfully.");
                    navigate("/");
                }
            }

        } catch (error) {
            setErrorText("An error occurred while deleting recipe: " + error);
            openErrorModal();
        }
    }

    const print = () =>{
        //TODO: tulostuksen käynnistys
    }

    return(
        <div>
            <div className='recipe-container'>
                <RecipeHead recipe={recipe} onDelete={openDeleteModal} route={route} isShareModalOpen={isShareModalOpen} onShare={openShareModal} /*image={image}*/ />
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
            {isShareModalOpen ? <ShareModal isOpen={isShareModalOpen} onClose={closeShareModal} onPrint={print} /> : null}
        </div>
    );
}

const RecipeHead = (props) =>{
    const recipe = props.recipe;
    const image = props.image;
    const createdFormatted = new Date(props.recipe.created).toLocaleDateString('fi-FI');
    
    const calculateAvgRating = () =>{
        //TODO: keskiarvon laskeminen
    }

    const saveToFavourites = () => {
        //TODO: tallentaminen suosikkeihin
    }

    const share = () => {
        props.onShare(true);
    }

    return(
        <div className='recipe-head'>
            <div>
                <h1>
                    {recipe.header}
                    <input type='image' src="/hearticon.ico" alt="Save to Favourites" onClick={saveToFavourites} className='picbutton' data-testid='saveToFavouritesButton' />
                    <input type='image' src="/share.ico" alt="Share" onClick={share} className='picbutton' data-testid='shareButton' />
                    <EllipsisMenu onDelete={props.onDelete} creator={recipe.username} route={props.route} />
                </h1>
                {/*<img src='/rating_star.png' alt="Star Rating"/>{recipe.rating}*/}
            </div>
            {/*image ? <img src={image} alt="Recipe Image" className='recipeimage'/>:null*/}
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
    //HUOM! Ei vielä käytössä
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
                        jos ei kirjautunut: <a>log in</a> to leave a review
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

const ShareModal = ({ isOpen, onClose, onPrint}) =>{
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`} data-testid={"share-dialog"}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-header'>Share this recipe!</h2>
                {/*Tähän se URL boksi! */}
                <button onClick={() => onPrint()} data-testid='print-button'>Print</button>
                {/*Printille joku nätimpi nappi? */}
            </div>
        </div>
    );
}

export { Recipe, RecipeHead, RecipeIngredients, RecipeSteps, DeleteDialog, ShareModal };