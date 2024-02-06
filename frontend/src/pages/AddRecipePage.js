import { useState } from 'react';
import { RecipeIngredients, RecipeSteps } from './RecipePage';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import { useToken } from '../customHooks/useToken';
import { useNavigate } from 'react-router-dom';

//myös muokkaus
const AddRecipe = (props) =>{
    const { addRecipeRoute } = props;
    const [token,] = useToken();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [durationH, setDurationH] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [image, setImage] = useState(''); //ei oliossa vielä tässä iteraatiossa
    const [keywords, setKeywords] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]); 
    const [visibleToAll, setVisibleToAll] = useState(1);

    const [isModalIOpen, setModalIOpen] = useState(false);
    const [isModalSOpen, setModalSOpen] = useState(false);
    const [isModalKOpen, setModalKOpen] = useState(false);

    const openModalI = () => setModalIOpen(true);
    const closeModalI = () => setModalIOpen(false);
    const openModalS = () => setModalSOpen(true);
    const closeModalS = () => setModalSOpen(false);
    const openModalK = () => setModalKOpen(true);
    const closeModalK = () => setModalKOpen(false);
    
    const navigate = useNavigate();

    const postRecipe = async () =>{
        const requestOptions ={
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : "Bearer " + token
            },
            body: JSON.stringify({
                header : name,
                description : description,
                visibleToAll : visibleToAll,
                durationHours : durationH,
                durationMinutes : durationMin,
                ingredients : ingredients,
                steps : steps,
                keywords : keywords
            })
        }

        try {
            const response = await fetch("http://localhost:3004/api/recipe", requestOptions);
            if(response.ok){
                const data = await response.json();
                addRecipeRoute(data.hash);
                navigate("/recipe/" + data.hash); //Miten se hash laitetaan tähän?
            }
        } catch (error) {
            window.alert("Unable to post recipe: ", error);
        }
    }

    const addStep = (instuctiontext) =>{
        setSteps([...steps, instuctiontext]);
        closeModalS();
    }

    const addIngredient = (quantity, unit, ingredient) =>{
        let q = quantity + " " + unit;
        setIngredients([...ingredients, {
            quantity : q,
            ingredient : ingredient
        }]);
        closeModalI();
    }

    const addKeyword = (keyword) =>{
        setKeywords([...keywords, keyword]);
        closeModalK();
    }

    const postBtnClicked = () =>{
        if(window.confirm("Are you sure you want to post this recipe? TastyBook is not responsible for any copyright-violations contained-in or concerning this recipe. You will be able to modify the recipe later.")){
            postRecipe();
        }
    }

    return(
        <div className='recipeform-body'>
            <table>
                <tbody className='recipeform-container'>
                    <tr className='recipeform-item'>
                        <th>Recipe name:</th>
                        <td><input className="recipeinput" type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Recipe description:</th>
                        <td><textarea className="recipeinput" rows="10" cols="40" value={description} onChange={(e) => setDescription(e.target.value)} /></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Visibility:</th>
                        <td>
                            <label>
                                <input className="recipeinput" type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setVisibleToAll(1):setVisibleToAll(0)}/>
                                Public
                            </label>
                            {visibleToAll?null:<p style={{color:"#3c493c", fontStyle:"italic"}}>Recipe will only be visible to registered users</p>}
                        </td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Recipe duration:</th>
                        <td>
                            <label>
                                <input className="recipeinput" type='number' value={durationH} min="0" max="200" onChange={(e) => setDurationH(parseInt(e.target.value))} /> hours 
                            </label> <br/>
                            <label>
                                <input className="recipeinput" type='number' value={durationMin} min="0" max="59" onChange={(e) => setDurationMin(parseInt(e.target.value))} /> minutes
                            </label>
                        </td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Image:</th>
                        <td>
                            <input className="recipeinput" type='file' value={image} accept="image/*" onChange={(e) => setImage(e.target.value)}/>
                        </td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Ingredients:</th>
                        <td>
                            {ingredients.length < 1 ? null : <RecipeIngredients ingredients={ingredients} />}
                        </td>
                        <td><button onClick={openModalI}>Add</button></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Steps:</th>
                        <td>
                            {steps.length < 1 ? null : <RecipeSteps steps={steps} page="recipeform"/>}
                        </td>
                        <td><button onClick={openModalS}>Add</button></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Keywords:</th>
                        <td>
                            {keywords.length < 1 ? null : <RecipeKeywords keywords={keywords} />}
                        </td>
                        <td><button onClick={openModalK}>Add</button></td>
                    </tr>
                    <tr>
                        <td>
                            <button className='postbutton' onClick={postBtnClicked} disabled={!name || !description || (durationH == 0 && durationMin == 0) || ingredients.length < 1 || steps.length < 1  || keywords.length < 1 }>Save & Post Recipe</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {isModalIOpen ? <IngredientDialog isOpen={isModalIOpen} onClose={closeModalI} onAdd={addIngredient}/> : null}
            {isModalSOpen ? <StepDialog isOpen={isModalSOpen} onClose={closeModalS} onAdd={addStep} /> : null}
            {isModalKOpen ? <KeywordDialog isOpen={isModalKOpen} onClose={closeModalK} onAdd={addKeyword}/> : null}
        </div>
    );
}

const RecipeKeywords = (props) =>{
    const words = props.keywords.map((word, i) =>{
        return <li key={i}>{word}</li>
    });

    return(
        <div>
            <ul>{words}</ul>
        </div>
    );
}

const IngredientDialog = ({ isOpen, onClose, onAdd}) =>{
    const [unitlist, setUnitlist] = useState(["whole", "half", "quarter", "cloves","kg", "g", "l", "dl", "cl", "ml", "tsp", "tbsp", "cups", "lbs"]);
    const [qt, setQt] = useState(0);
    const [ing, setIng] = useState('');
    const [unit, setUnit] = useState('');

    const units = unitlist.map((u,i)=>{
        return <option key={i}>{u}</option>
    });

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <table>
                    <tbody>
                        <tr>
                            <td className="modal-text">Quantity:</td>
                            <td>
                                <input type='number' className="modalInput" value={qt} min="0" onChange={(e) =>setQt(e.target.value)}/>
                                <select value={unit} className="modalInput" onChange={(e)=>setUnit(e.target.value)}>{units}</select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ingredient:</td>
                            <td><input type='text' className="modalInput" value={ing} onChange={(e)=>setIng(e.target.value)}/></td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={() => onAdd(qt, unit, ing)} disabled={qt == 0 || !ing}>Add Ingredient</button>
            </div>
        </div>
    );
}

const StepDialog = ({ isOpen, onClose, onAdd }) =>{
    const [text, setText] = useState('');
    
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <label>
                    <b className="modal-text">Type instructions:</b><br/>
                    <textarea rows="10" cols="55" className="modalInput" value={text} onChange={(e) => setText(e.target.value)}/><br/>
                </label>
                <button onClick={() => onAdd(text)} disabled={!text}>Add Step</button>
            </div>
        </div>
    );
}

const KeywordDialog =({ isOpen, onClose, onAdd }) =>{
    const [w, setW] = useState('');

    return(
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <label>
                    <b className="modal-text">Type keyword:</b>
                    <input type='text' className="modalInput" value={w} onChange={(e) => setW(e.target.value)}/><br/>
                </label>
                <button onClick={() => onAdd(w)} disabled={!w}>Add Keyword</button>
            </div>
        </div>
    );
}

export {AddRecipe, RecipeKeywords, IngredientDialog, StepDialog, KeywordDialog};