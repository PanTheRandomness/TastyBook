import { useState, useEffect } from 'react';
import { useToken } from '../customHooks/useToken';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import '../Styles/Ellipsis.css';
import '../Styles/Print.css';
import { useNavigate } from 'react-router-dom';
import EllipsisMenu from '../components/EllipsisMenu';
import ErrorModal  from '../components/ErrorModal';
import { fetchRecipe, removeRecipe, addReview} from '../api/recipeApi'; 
import {Reviews} from '../components/Reviews'; 
import {RecipeList} from '../components/RecipeList';
import { addToFavorites } from '../api/favoriteApi';

const Recipe = (props) => {
    const { route } = props;
    const [currentUrl, setCurrentUrl] = useState('');
    const [token] = useToken();
    const navigate = useNavigate();
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const openDeleteModal = () => setDeleteModalOpen(true);
    const closeDeleteModal = () => setDeleteModalOpen(false);
    const [image, setImage] = useState(null);

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const openErrorModal = () => setErrorModalOpen(true);
    const closeErrorModal = () => { setErrorModalOpen(false); setErrorText(''); }

    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const openShareModal = () => setShareModalOpen(true);
    const closeShareModal = () => setShareModalOpen(false);
    const [copied, setCopied] = useState(false);

    const [recipe, setRecipe] = useState({
        "id" : 0,
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
        "reviews" : [],
       "average_rating": 0
        });

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    useEffect(() => {
        const getRecipe = async () => {
            try {
                const response = await fetchRecipe(token, route);
                setRecipe(response);
                if(token){
                    try {
                        const imgresponse = await fetch("http://localhost:3004/api/recipe/image/" + route, {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });
                        if (imgresponse.ok) {
                            const blob = await imgresponse.blob();
                            setImage(blob);
                        } else {
                            setImage(null);
                        }
                    } catch (error) {
                        setErrorText("An error occurred while loading recipe's image: " + error);
                        openErrorModal();
                    }
                }
                else {
                    try {
                        const imgresponse = await fetch("http://localhost:3004/api/recipe/image/" + route);
                        if (imgresponse.ok) {
                            const blob = await imgresponse.blob();
                            setImage(blob);
                        } else {
                            setImage(null);
                        }
                    } catch (error) {
                        setErrorText("An error occurred while loading recipe's image: " + error);
                        openErrorModal();
                    }
                }
            } catch (error) {
                setErrorText("An error occurred while loading recipe: " + error);
                openErrorModal();
            }
        }
        getRecipe();
    }, [route]);

    const copyUrlToClipboard = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 5000);
            })
            .catch((error) => {
                setErrorText("An error occurred while loading recipe: " + error);
                openErrorModal();
            });
    };

    const deleteRecipe = async () => {
        try {
            console.log("Starting deletion...");
            closeDeleteModal();
            const response = await removeRecipe(token, route);
            if (response.ok) {
                console.log("Recipe deleted successfully.");
                navigate("/");
            }

        } catch (error) {
            setErrorText("An error occurred while deleting recipe: " + error);
            openErrorModal();
        }
    }

    const toSearch = (keyword) => {
        navigate(`/search/${keyword}`);
    }

    const postReview = async (text,rating) => { 
        try {
            if (!token) {
                throw new Error('User token not found');
            }
    
            // Lähetetään HTTP POST -pyyntö uuden arvion lisäämiseksi
            await addReview(token, {text:text, rating:rating, recipeId:recipe.id});       
           
        } catch (error) {
            //console.error('Error adding review:', error.message);
            setErrorText('Login first' );
            openErrorModal();
        }

        try {
            const response = await fetchRecipe(token, route);
                setRecipe(response);

        }
        catch (error) {
            setErrorText("An error occurred while deleting recipe: " + error);
            openErrorModal();

        }
    }
    
    
    
    return(
        <div>
            <div className='recipe-border'>
                <div className='recipe-container'>
                    <RecipeHead recipe={recipe} onDelete={openDeleteModal} route={route} isShareModalOpen={isShareModalOpen} onShare={openShareModal} image={image} onSearch={toSearch} />
                    <div className="separator"></div>
                    <div className='recipe'>
                        <RecipeIngredients ingredients={recipe.ingredients} page="recipepage" />
                        <RecipeSteps steps={recipe.steps} />
                    </div>
                </div>
                <Reviews reviews={recipe.reviews} postReview={postReview}/>    
            </div>
            {isDeleteModalOpen ? <DeleteDialog isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={deleteRecipe} /> : null}
            {isErrorModalOpen ? <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errortext={errorText} /> : null}
            {isShareModalOpen ? <ShareModal isOpen={isShareModalOpen} onClose={closeShareModal} url={currentUrl} onCopy={copyUrlToClipboard} copied={copied} /> : null}
        </div>
    );
}

const RecipeHead = (props) => {
    const recipe = props.recipe;
    const image = props.image;
    const createdFormatted = new Date(props.recipe.created).toLocaleDateString('fi-FI');

    const calculateAvgRating = () => {
        //TODO: keskiarvon laskeminen, tuleeko tähän vai muualle?
    }

    const saveToFavourites = async (recipeId, userToken) => {
        try {
            const response = await addToFavorites(recipeId, userToken);
            console.log('Recipe added to favorites:', response);
        } catch (error) {
            console.error(error.message);
        }
    }
    
    const share = () => {
        props.onShare(true);
    }
    const print = () => {
        window.print();
    }

    return (
        <div className='recipe-head'>
            <div className='recipehead-container'>
                <h1 style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }} data-testid="recipeheader">
                    {/*Ellipsin sijoittelu!*/}
                    {recipe.header}
                    <input type='image' src="/hearticon.ico" alt="Save to Favourites" onClick={saveToFavourites} className='picbutton' data-testid='saveToFavouritesButton' />
                    <input type='image' src="/share.ico" alt="Share" onClick={share} className='picbutton' data-testid='shareButton' />
                    <button className='printbutton' onClick={print}>Print</button>
                    <EllipsisMenu onDelete={props.onDelete} creator={recipe.username} route={props.route} />
                </h1>
                {/*<img src='/rating_star.png' alt="Star Rating"/>{recipe.rating}*/}
                <p>{recipe.description}</p>
                <p> Created By: {recipe.username} <br />
                    Creation date: {createdFormatted} <br />
                    <i>Duration: {recipe.durationHours}h {recipe.durationMinutes}min</i>
                </p>
                <RecipeKeywords keywords={recipe.keywords} onSearch={props.onSearch} /> <br />
            </div>
            <div className='image-container'>
                {image ? <img src={URL.createObjectURL(image)} alt="Recipe Image" className='recipeimage' /> : null}
            </div>
        </div>
    );
}

const RecipeKeywords = (props) => {

    const words = props.keywords.map((w, i) => {
        return <li key={i}><a onClick={() => props.onSearch(w.word)}>{w.word}</a></li>
    });

    return (
        <ul className='keywords'>
            {words}
        </ul>
    );
}

const RecipeIngredients = (props) => {
    const ingredientList = props.ingredients.map((ing, i) => {
        return <tr key={i}><th>{ing.quantity} {ing.unit}</th><td>{ing.name}</td></tr>
    });

    return (
        <table className='recipe-ingredients'>
            <tbody>{ingredientList}</tbody>
        </table>
    );
}

const RecipeSteps = (props) => {
    const steps = props.steps.map((step, i) => {
        return <li key={i}>{step.step} </li>
    });

    return (
        <div className='recipe-steps'>
            <ol className="recipepage-step">{steps}</ol>
        </div>
    );
}

const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
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

const ShareModal = ({ isOpen, onClose, url, onCopy, copied }) => {

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`} data-testid={"share-dialog"}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-header'>Share this recipe!</h2>
                <p className='modal-text'>Copy the link below or print this recipe:</p>
                <div className="modal-group">
                    <input type='text' className='url' value={url} readonly />
                    <button onClick={() => onCopy()} className='copy-button' data-testid='copy-button'>Copy</button>
                </div>
                {copied ? <p className="copied-message"><i>Link has been successfully coped to clipboard!</i></p> : null}
                {/*Tähän myös voi lisätä some-jakamispainikkeita, jos haluaa ja aikaa jää! */}
            </div>
        </div>
    );
}

export { Recipe, RecipeHead, RecipeIngredients, RecipeSteps, DeleteDialog, ShareModal };