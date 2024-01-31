import { useState, useEffect } from 'react';
import { RecipeIngredients, RecipeSteps } from './RecipePage';
import '../Styles/Modal.css';
import '../Styles/AddRecipe.css';
//myös muokkaus

const AddRecipe = () =>{
    const [recipeId,setRecipeId] = useState(1);//ei oliossa
    const [recipe, setRecipe] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [durationH, setDurationH] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [image, setImage] = useState(''); //ei oliossa
    const [keywords, setKeywords] = useState([]);//miten olioon?
    const [ingredients, setIngredients] = useState([]);//miten olioon?
    const [steps, setSteps] = useState([]); //miten olioon?
    const [visibleToAll, setVisibleToAll] = useState(true);

    const [isModalIOpen, setModalIOpen] = useState(false);
    const [isModalSOpen, setModalSOpen] = useState(false);
    const [isModalKOpen, setModalKOpen] = useState(false);

    const openModalI = () => setModalIOpen(true);
    const closeModalI = () => setModalIOpen(false);
    const openModalS = () => setModalSOpen(true);
    const closeModalS = () => setModalSOpen(false);
    const openModalK = () => setModalKOpen(true);
    const closeModalK = () => setModalKOpen(false);

    const addStep = (instuctiontext) =>{
        setSteps([...steps, instuctiontext]);
        closeModalS();
    }

    const addIngredient = (quantity, unit, ingredient) =>{
        setIngredients([...ingredients, {
            quantity : quantity,
            unit : unit,
            ingredient : ingredient
        }]);
        closeModalI();
    }

    const addKeyword = (keyword) =>{
        setKeywords([...keywords, keyword]);
        closeModalK();
    }

    const saveBtnClicked = () =>{
        //virheentarkistus, onko tarpeelliset täytetty
        //Miten id?
        //PVM & Creator
        setRecipe({
            id : "",
            header : name,
            description : description,
            visibleToAll : visibleToAll,
            durationHours : durationH,
            durationMinutes : durationMin,
            ingredients : ingredients,
            steps : steps,
            keywords : keywords
        });
        console.log(recipe);
        setName('');
        setDescription('');
        setDurationH(0);
        setDurationMin(0);
        setIngredients([]);
        setSteps([]);
        setKeywords([]);
        setVisibleToAll(true);
        setRecipe({});
    }

    return(
        <div>
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
                                <input className="recipeinput" type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setVisibleToAll(true):setVisibleToAll(false)}/>
                                Public
                            </label>
                            {visibleToAll?null:<p style={{color:"red", fontStyle:"italic"}}>Recipe will only be visible to registered users</p>}
                        </td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Recipe duration:</th>
                        <td>
                            <label>
                                <input className="recipeinput" type='number' value={durationH} min="0" max="200" onChange={(e) => setDurationH(e.target.value)} /> hours 
                            </label> <br/>
                            <label>
                                <input className="recipeinput" type='number' value={durationMin} min="0" max="59" onChange={(e) => setDurationMin(e.target.value)} /> minutes
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
                            {steps.length < 1 ? null : <RecipeSteps steps={steps} />}
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
                            <button className='savebutton' onClick={saveBtnClicked}>Save Recipe</button>
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
    const [qt, setQt] = useState(0); //onko jokin yksinkertaisempi, let tms?
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
                            <td>Quantity:</td>
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
                <button onClick={() => onAdd(qt, unit, ing)}>Add Ingredient</button>
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
                    <b>Type instructions:</b><br/>
                    <textarea rows="10" cols="55" className="modalInput" value={text} onChange={(e) => setText(e.target.value)}/><br/>
                </label>
                <button onClick={() => onAdd(text)}>Add Step</button>
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
                    <b>Type keyword:</b>
                    <input type='text' className="modalInput" value={w} onChange={(e) => setW(e.target.value)}/><br/>
                </label>
                <button onClick={() => onAdd(w)}>Add Keyword</button>
            </div>
        </div>
    );
}

export {AddRecipe, RecipeKeywords, IngredientDialog, StepDialog, KeywordDialog};