import { useState, useEffect } from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import { useToken } from '../customHooks/useToken';
import { useNavigate } from 'react-router-dom';
import { RecipeKeywords, KeywordDialog } from '../components/addRecipeComponents/RecipeKeywords';
import { RecipeSteps, StepDialog } from '../components/addRecipeComponents/RecipeSteps';
import { RecipeIngredients, IngredientDialog } from '../components/addRecipeComponents/RecipeIngredients';
import ErrorModal from '../components/ErrorModal';

const AddRecipe = (props) => {
    const { addRecipeRoute, route } = props;
    const [token,] = useToken();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [durationH, setDurationH] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [image, setImage] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);
    const [visibleToAll, setVisibleToAll] = useState(1);

    const [isModalIOpen, setModalIOpen] = useState(false);
    const [isModalSOpen, setModalSOpen] = useState(false);
    const [isModalKOpen, setModalKOpen] = useState(false);
    const [isSaveModalOpen, setSaveModalOpen] = useState(false);

    const openModalI = () => setModalIOpen(true);
    const closeModalI = () => { setModalIOpen(false); setQt(0); setUnit(''); setIng(''); setEditingIngredient(false); }
    const openModalS = () => setModalSOpen(true);
    const closeModalS = () => { setModalSOpen(false); setText(''); setEditingStep(false); }
    const openModalK = () => setModalKOpen(true);
    const closeModalK = () => { setModalKOpen(false); setW(''); setEditingKeyword(false); }
    const openSaveModal = () => setSaveModalOpen(true);
    const closeSaveModal = () => setSaveModalOpen(false);

    const [text, setText] = useState('');
    const [w, setW] = useState('');
    const [qt, setQt] = useState(0);
    const [ing, setIng] = useState('');
    const [unit, setUnit] = useState('');
    const [editingIngredient, setEditingIngredient] = useState(false);
    const [editingStep, setEditingStep] = useState(false);
    const [editingKeyword, setEditingKeyword] = useState(false);
    const [eStepIndex, setEStepIndex] = useState(-1);
    const [eIngIndex, setEIngIndex] = useState(-1);
    const [eKeywordIndex, setEKeywordIndex] = useState(-1);

    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const [id, setId] = useState(null);
    const [wrongImage, setWrongImage] = useState(false);
    const [imageChanged, setImageChanged] = useState(false);

    const [isErrorModalOpen, setErrorModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('');
    const openErrorModal = () => setErrorModalOpen(true);
    const closeErrorModal = () => { setErrorModalOpen(false); setErrorText(''); }

    useEffect(() => {
        const loadrecipe = async () => {
            const requestOptions = {
                headers: {
                    'Authorization': "Bearer " + token
                }
            }
            try {
                const response = await fetch("http://localhost:3004/api/recipe/" + route, requestOptions);
                if (response.ok) {
                    const r = await response.json();
                    setEditing(true);
                    setName(r.header);
                    setVisibleToAll(r.visibleToAll);
                    setDescription(r.description);
                    setDurationH(r.durationHours);
                    setDurationMin(r.durationMinutes);
                    setIngredients(r.ingredients);
                    setSteps(r.steps.map(item => item.step));
                    setKeywords(r.keywords.map(item => item.word));
                    setId(r.id);
                    //Jos ID:llä löytyy kuva => setImage
                } else {
                    throw new Error('Recipe not found');
                }
            } catch (error) {
                setErrorText("An error occurred while loading recipe: " + error);
                openErrorModal();
            }
        }
        if (route) loadrecipe();
    }, []);

    const postRecipe = async () => {
        const formData = new FormData();
        formData.append("header", name);
        formData.append("description", description);
        formData.append("visibleToAll", visibleToAll);
        formData.append("durationHours", durationH);
        formData.append("durationMinutes", durationMin);
        formData.append("ingredients", JSON.stringify(ingredients));
        formData.append("steps", JSON.stringify(steps));
        formData.append("keywords", JSON.stringify(keywords));
        formData.append('image', image);

        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + token
            },
            body: formData
        }

        try {
            const response = await fetch("http://localhost:3004/api/recipe", requestOptions);
            if (response.ok) {
                const data = await response.json();
                addRecipeRoute(data.hash);
                /*if(image){
                    const finalImage = {
                        Recipe_id : data.id,
                        filename : image
                    }
                    try {
                        const response = await fetch("http://localhost:3004/api/image", {
                            method: 'POST',
                            headers: {
                                'Authorization' : "Bearer " + token
                            },
                            body: formData
                        });

                        if (response.ok) {
                            // Kuva tallennettu onnistuneesti, ohjaa käyttäjä reseptisivulle
                        }
                    } catch (error) {
                        setErrorText("Unable to post image: " + error);
                        openErrorModal();
                    }
                }*/
                navigate("/recipe/" + data.hash);
            }
        } catch (error) {
            setErrorText("Unable to post recipe: " + error);
            openErrorModal();
        }
    }

    const saveRecipe = async () => {
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: JSON.stringify({
                id: id,
                header: name,
                description: description,
                visibleToAll: visibleToAll,
                durationHours: durationH,
                durationMinutes: durationMin,
                steps: steps,
                keywords: keywords,
                ingredients: ingredients
            })
        }

        try {
            console.log("Save modified called...");
            const response = await fetch("http://localhost:3004/api/recipe/" + route, requestOptions);
            if (response.ok) {
                /*if(imageChanged){
                    const finalImage = {
                        Recipe_id : data.id,
                        filename : image
                    }
                    try {
                        const response = await fetch("http://localhost:3004/api/image", {
                            method: 'PUT',
                            headers: {
                                'Authorization' : "Bearer " + token
                            },
                            body: formData
                        });

                        if (response.ok) {
                            // Kuva tallennettu onnistuneesti, ohjaa käyttäjä reseptisivulle
                        }
                    } catch (error) {
                        setErrorText("Unable to save modified image: " + error);
                        openErrorModal();
                    }
                }*/
                navigate("/recipe/" + route);
                setEditing(false);
            }
        } catch (error) {
            console.error("Error while saving modified recipe:", error);
            setErrorText("Unable to post modified recipe: " + error);
            openErrorModal();
        }
    }

    const addIngredient = (quantity, unit, ingredient) => {
        let q = quantity + " " + unit;
        setIngredients([...ingredients, {
            quantity: q,
            name: ingredient
        }]);
        closeModalI();
    }

    const editIngredient = (ingredient) => {
        const index = ingredients.indexOf(ingredient);
        if (index !== -1) {
            setEIngIndex(index);
            if(ingredient.quantity){
                const [quantity, unit] = ingredient.quantity.split(' ');
                setQt(parseFloat(quantity));
                setUnit(unit);
            }
            setIng(ingredient.name);
            setEditingIngredient(true);
            openModalI();
        } else {
            setErrorText("Ingredient not found: " + ingredient);
            openErrorModal();
        }
    }

    const saveEditedIngredient = () => {
        let newQuantity = qt + " " + unit;
        if(qt == 0) newQuantity = unit;
        const editedIngredient = {
            quantity: newQuantity,
            name: ing
        };
        const updatedIngredients = [...ingredients];
        updatedIngredients[eIngIndex] = editedIngredient;
        setIngredients(updatedIngredients);
        console.log("Edited ingredient: " + editedIngredient.name);
        closeModalI();
        setEditingIngredient(false);
        setEIngIndex(-1);
    }

    const removeIngredient = (ingredient) => {
        const index = ingredients.indexOf(ingredient);
        if (index !== -1) {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
            console.log("Removed ingredient: ", ingredient);
        } else {
            setErrorText("Ingredient not found: " + ingredient);
            openErrorModal();
        }
    }

    const addStep = (step) => {
        setSteps([...steps, step]);
        closeModalS();
    }

    const editStep = (step) => {
        const index = steps.indexOf(step);
        if (index !== -1) {
            setEStepIndex(index);
            setEditingStep(true);
            setText(step);
            openModalS();
        } else {
            setErrorText("Step not found: " + step);
            openErrorModal();
        }
    }

    const saveEditedStep = (step) => {
        const updatedSteps = [...steps];
        updatedSteps[eStepIndex] = step;
        setSteps(updatedSteps);
        console.log("Edited step: " + step);
        closeModalS();
        setEditingStep(false);
        setEStepIndex(-1);
    }

    const removeStep = (step) => {
        const index = steps.indexOf(step);
        if (index !== -1) {
            const newSteps = [...steps];
            newSteps.splice(index, 1);
            setSteps(newSteps);

            console.log("Removed step: " + step);
        } else {
            setErrorText("Step not found: " + step);
            openErrorModal();
        }
    }

    const addKeyword = (keyword) => {
        setKeywords([...keywords, keyword]);
        closeModalK();
    }

    const editKeyword = (keyword) => {
        const index = keywords.indexOf(keyword);
        if (index !== -1) {
            setEKeywordIndex(index);
            setEditingKeyword(true);
            setW(keyword);
            openModalK();
        } else {
            setErrorText("Keyword not found: " + keyword);
            openErrorModal();
        }
    }

    const saveEditedKeyword = (keyword) => {
        const updatedKeywords = [...keywords];
        updatedKeywords[eKeywordIndex] = keyword;
        setKeywords(updatedKeywords);
        console.log("Edited keyword: " + keyword);
        closeModalK();
        setEditingKeyword(false);
        setW('');
        setEKeywordIndex(-1);
    }

    const removeKeyword = (word) => {
        const index = keywords.indexOf(word);
        if (index !== -1) {
            const newKeywords = [...keywords];
            newKeywords.splice(index, 1);
            setKeywords(newKeywords);

            console.log("Removed keyword: " + word);
        } else {
            setErrorText("Keyword not found: " + word);
            openErrorModal();
        }
    }

    const handleHoursChange = (e) => {
        let value = parseInt(e.target.value);
        if (value > 200) {
            value = 200;
        }
        setDurationH(value);
    }

    const handleMinutesChange = (e) => {
        let value = parseInt(e.target.value);
        if (value > 59) {
            value = 59;
        }
        setDurationMin(value);
    }

    const postBtnClicked = () => {
        openSaveModal();
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileSize = file.size / 1024 / 1024;
            if ((file.type === 'image/jpeg' || file.type === 'image/png') && fileSize <= 16) {
                setImage(file);
                setWrongImage(false);
            } else {
                setWrongImage(true);
                setImage(null);
                e.target.value = null;
            }
        }
        if (editing) setImageChanged(true);
    }

    return (
        <div className='recipeform-body'>
            <div className='recipeform'>
                <div className='recipeform-top'>
                    <h1>New Recipe:</h1>
                </div>
                <div className='recipeform-mid'>
                    <table className='recipeform-left'>
                        <tbody className='recipeform-container'>
                            <tr className='recipeform-item'>
                                <th>Recipe name:</th>
                                <td><input data-testid="recipeNameInput" className="recipeinput" type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Recipe description:</th>
                                <td><textarea data-testid="recipeDescriptionInput" className="recipeinput" rows="10" cols="50" value={description} onChange={(e) => setDescription(e.target.value)} /></td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Visibility:</th>
                                <td>
                                    <label>
                                        <input data-testid="visibleInput" className="recipeinput" type='checkbox' defaultChecked={true} onChange={(e) => e.target.checked ? setVisibleToAll(1) : setVisibleToAll(0)} />
                                        Public
                                        {visibleToAll ? null : <div style={{ color: "#412E27", fontStyle: "italic" }} className='visibilityMessage'>Recipe will only be visible to registered users</div>}
                                    </label>
                                </td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Recipe duration:</th>
                                <td>
                                    <label>
                                        <input data-testid="recipeHoursInput" className="recipeinput" type='number' value={durationH} min="0" max="200" onChange={(e) => handleHoursChange(e)} /> hours
                                    </label> <br />
                                    <label>
                                        <input data-testid="recipeMinutesInput" className="recipeinput" type='number' value={durationMin} min="0" max="59" onChange={(e) => handleMinutesChange(e)} /> minutes
                                    </label>
                                </td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Image:</th>
                                <td>
                                    <input data-testid="recipeImageInput" className="recipeinput" type='file' accept=".jpeg, .jpg, .png*" onChange={(e) => handleImageChange(e)} />
                                    { wrongImage ? <div  style={{ color: "#412E27", fontStyle: "italic" }} className='visibilityMessage'>Please choose either a -jpeg- or .png-file. Maximum filesize is 16MB</div> : null}
                                    {/*Ei vielä testattu?*/}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className='recipeform-right'>
                        <tbody className='recipeform-container'>
                            <tr className='recipeform-item'>
                                <th>Ingredients:</th><button data-testid="addIngredient" className='addbutton' onClick={openModalI}>+</button>
                                <td>
                                    {ingredients.length < 1 ? null : <RecipeIngredients ingredients={ingredients} page="recipeform" onEdit={editIngredient} onRemove={removeIngredient} />}
                                </td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Steps:</th><button data-testid="addStep" className='addbutton' onClick={openModalS}>+</button>
                                <td>
                                    {steps.length < 1 ? null : <RecipeSteps steps={steps} onEdit={editStep} onRemove={removeStep} />}
                                </td>
                            </tr>
                            <tr className='recipeform-item'>
                                <th>Keywords:</th><button data-testid="addKeyword" className='addbutton' onClick={openModalK}>+</button>
                                <td>
                                    {keywords.length < 1 ? null : <RecipeKeywords keywords={keywords} onEdit={editKeyword} onRemove={removeKeyword} />}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className='recipeform-bottom'>
                    {!editing ?
                        <button className='postbutton' onClick={postBtnClicked} disabled={!name || !description || (durationH == 0 && durationMin == 0) || ingredients.length < 1 || steps.length < 1 || keywords.length < 1}>Save & Post Recipe</button> :
                        <button className='saverecipebutton' onClick={postBtnClicked} disabled={!name || !description || (durationH == 0 && durationMin == 0) || ingredients.length < 1 || steps.length < 1 || keywords.length < 1}>Save Recipe</button>
                    }
                </div>
            </div>
            {isModalIOpen ? <IngredientDialog isOpen={isModalIOpen} onClose={closeModalI} onAdd={addIngredient} onSaveEdited={saveEditedIngredient} editingIngredient={editingIngredient} qt={qt} onQtChange={setQt} unit={unit} onUnitChange={setUnit} ing={ing} onIngChange={setIng} /> : null}
            {isModalSOpen ? <StepDialog isOpen={isModalSOpen} onClose={closeModalS} onAdd={addStep} onSaveEdited={saveEditedStep} editingStep={editingStep} text={text} onTextChange={setText} /> : null}
            {isModalKOpen ? <KeywordDialog isOpen={isModalKOpen} onClose={closeModalK} onAdd={addKeyword} onSaveEdited={saveEditedKeyword} editingKeyword={editingKeyword} w={w} onWChange={setW} /> : null}
            {!isSaveModalOpen ? null : editing ? <SaveDialog isOpen={isSaveModalOpen} onClose={closeSaveModal} onConfirm={saveRecipe} title={"Do you want to save this recipe?"} /> : <SaveDialog isOpen={isSaveModalOpen} onClose={closeSaveModal} onConfirm={postRecipe} title={"Do you want to post this recipe?"} />}
            {isErrorModalOpen ? <ErrorModal isOpen={isErrorModalOpen} onClose={closeErrorModal} errortext={errorText} /> : null}
        </div>
    );
}

const SaveDialog = ({ isOpen, onClose, onConfirm, title }) => {
    let text = "Are you sure you want to save this recipe? TastyBook is not responsible for any copyright infringments or other violations contained in, or concerning this recipe. You will be able to modify the recipe later.";
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`} data-testid={"save-dialog"}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-header'>{title}</h2>
                <p className='modal-text'>{text}</p>
                <button onClick={() => onConfirm()} data-testid='confirm-button'>Confirm</button>
                <button onClick={() => onClose()} data-testid='cancel-button'>Cancel</button>
            </div>
        </div>
    );
}

export { AddRecipe, SaveDialog };