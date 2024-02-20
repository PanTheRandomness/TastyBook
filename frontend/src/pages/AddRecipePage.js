import { useState, useEffect} from 'react';
import '../Styles/Modal.css';
import '../Styles/Recipe.css';
import { useToken } from '../customHooks/useToken';
import { useNavigate } from 'react-router-dom';
import { RecipeKeywords, KeywordDialog } from '../components/addRecipeComponents/RecipeKeywords';
import { RecipeSteps, StepDialog } from '../components/addRecipeComponents/RecipeSteps';
import { RecipeIngredients, IngredientDialog } from '../components/addRecipeComponents/RecipeIngredients';

const AddRecipe = (props) =>{
    const { addRecipeRoute, route } = props;
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
    const closeModalI = () => {setModalIOpen(false); setQt(0); setUnit(''); setIng(''); setEditingIngredient(false);}
    const openModalS = () => setModalSOpen(true);
    const closeModalS = () => {setModalSOpen(false); setText(''); setEditingStep(false);}
    const openModalK = () => setModalKOpen(true);
    const closeModalK = () => {setModalKOpen(false); setW(''); setEditingKeyword(false);}
    
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

    useEffect(()=>{
        const loadrecipe = async () =>{
            const requestOptions ={
                headers: {
                    'Authorization' : "Bearer " + token
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
                } else {
                    throw new Error('Recipe not found');
                }
            } catch (error) {
                window.alert("An error occurred while loading recipe: " + error);
            }
        }
        if(route)loadrecipe();
    },[]);

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
                navigate("/recipe/" + data.hash);
            }
        } catch (error) {
            window.alert("Unable to post recipe: " + error);
        }
    }

    const saveRecipe = async () =>{
        const requestOptions ={
            method:'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : "Bearer " + token
            },
            body: JSON.stringify({
                id: id,
                header : name,
                description : description,
                visibleToAll : visibleToAll,
                durationHours : durationH,
                durationMinutes : durationMin,
                steps : steps,
                keywords : keywords,
                ingredients : ingredients
            })
        }

        try {
            console.log("Save modified called...");
            const response = await fetch("http://localhost:3004/api/recipe/" + route, requestOptions);
            if(response.ok){
                navigate("/recipe/" + route);
                setEditing(false);
            } else {
                console.log("Response status:", response.status);
                window.alert("Failed to save modified recipe. Status: " + response.status);
            }
        } catch (error) {
            console.error("Error while saving modified recipe:", error);
            window.alert("Unable to post modified recipe: " + error);
        }
    }

    const addIngredient = (quantity, unit, ingredient) =>{
        let q = quantity + " " + unit;
        setIngredients([...ingredients, {
            quantity : q,
            name : ingredient
        }]);
        closeModalI();
    }

    const editIngredient = (ingredient) =>{
        const index = ingredients.indexOf(ingredient);
        if (index !== -1) {
            setEIngIndex(index);
            const [quantity, unit] = ingredient.quantity.split(' ');
            setQt(parseFloat(quantity));
            setUnit(unit);
            setIng(ingredient.name);
            setEditingIngredient(true);
            openModalI();
        } else {
            window.alert("Ingredient not found: " + ingredient);
        }
    }

    const saveEditedIngredient = () =>{
        const newQuantity = qt + " " + unit;
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

    const removeIngredient = (ingredient) =>{
        const index = ingredients.indexOf(ingredient);
        if (index !== -1) {
            const newIngredients = [...ingredients];
            newIngredients.splice(index, 1);
            setIngredients(newIngredients);
            console.log("Removed ingredient: ", ingredient);
        } else {
            window.alert("Ingredient not found: ", ingredient);
        }
    }

    const addStep = (step) =>{
        setSteps([...steps, step]);
        closeModalS();
    }

    const editStep = (step) =>{
        const index = steps.indexOf(step);
        if (index !== -1) {
            setEStepIndex(index);
            setEditingStep(true);
            setText(step);
            openModalS();
        } else {
            window.alert("Step not found: " + step);
        }
    }

    const saveEditedStep = (step) =>{
        const updatedSteps = [...steps];
        updatedSteps[eStepIndex] = step;
        setSteps(updatedSteps);
        console.log("Edited step: " + step);
        closeModalS();
        setEditingStep(false);
        setEStepIndex(-1);
    }

    const removeStep= (step) =>{
        const index = steps.indexOf(step);
        if (index !== -1) {
            const newSteps = [...steps];
            newSteps.splice(index, 1);
            setSteps(newSteps);
    
            console.log("Removed step: " + step);
        } else {
            window.alert("Step not found: " + step);
        }
    }

    const addKeyword = (keyword) =>{
        setKeywords([...keywords, keyword]);
        closeModalK();
    }

    const editKeyword = (keyword) =>{
        const index = keywords.indexOf(keyword);
        if (index !== -1) {
            setEKeywordIndex(index);
            setEditingKeyword(true);
            setW(keyword);
            openModalK();
        } else {
            window.alert("Keyword not found: " + keyword);
        }
    }

    const saveEditedKeyword = (keyword) =>{
        const updatedKeywords = [...keywords];
        updatedKeywords[eKeywordIndex] = keyword;
        setKeywords(updatedKeywords);
        console.log("Edited keyword: " + keyword);
        closeModalK();
        setEditingKeyword(false);
        setW('');
        setEKeywordIndex(-1);
    }

    const removeKeyword = (word) =>{
        const index = keywords.indexOf(word);
        if (index !== -1) {
            const newKeywords = [...keywords];
            newKeywords.splice(index, 1);
            setKeywords(newKeywords);
    
            console.log("Removed keyword: " + word);
        } else {
            window.alert("Keyword not found: " + word);
        }
    }

    const handleHoursChange = (e) =>{
        let value = parseInt(e.target.value);
        if (value > 200) {
          value = 200;
        }
        setDurationH(value);
    }

    const handleMinutesChange = (e) =>{
        let value = parseInt(e.target.value);
        if (value > 59) {
          value = 59;
        }
        setDurationMin(value);
    }

    const postBtnClicked = () =>{
        if(editing){
            if(window.confirm("Are you sure you want to save this recipe? TastyBook is not responsible for any copyright infringments or other violations contained in, or concerning this recipe. You will be able to modify the recipe later.")){
                saveRecipe();
            }
        }
        else{
            if(window.confirm("Are you sure you want to post this recipe? TastyBook is not responsible for any copyright infringments or other violations contained in, or concerning this recipe. You will be able to modify the recipe later.")){
                postRecipe();
            }
        }
    }

    return(
        <div className='recipeform-body'>
            <table>
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
                                <input data-testid="recipeHoursInput" className="recipeinput" type='number' value={durationH} min="0" max="200" onChange={(e) => handleHoursChange(e)} /> hours 
                            </label> <br/>
                            <label>
                                <input data-testid="recipeMinutesInput" className="recipeinput" type='number' value={durationMin} min="0" max="59" onChange={(e) => handleMinutesChange(e)} /> minutes
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
                            {ingredients.length < 1 ? null : <RecipeIngredients ingredients={ingredients} page="recipeform" onEdit={editIngredient} onRemove={removeIngredient}/>}
                        </td>
                        <td><button data-testid="addIngredient" className='addbutton' onClick={openModalI}>Add ingredient</button></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Steps:</th>
                        <td>
                            {steps.length < 1 ? null : <RecipeSteps steps={steps} onEdit={editStep} onRemove={removeStep}/>}
                        </td>
                        <td><button data-testid="addStep" className='addbutton' onClick={openModalS}>Add step</button></td>
                    </tr>
                    <tr className='recipeform-item'>
                        <th>Keywords:</th>
                        <td>
                            {keywords.length < 1 ? null : <RecipeKeywords keywords={keywords} onEdit={editKeyword} onRemove={removeKeyword}/>}
                        </td>
                        <td><button data-testid="addKeyword" className='addbutton' onClick={openModalK}>Add keyword</button></td>
                    </tr>
                    <tr>
                        <td>
                            {!editing?
                                <button className='postbutton' onClick={postBtnClicked} disabled={!name || !description || (durationH == 0 && durationMin == 0) || ingredients.length < 1 || steps.length < 1  || keywords.length < 1 }>Save & Post Recipe</button>:
                                <button className='saverecipebutton' onClick={postBtnClicked} disabled={!name || !description || (durationH == 0 && durationMin == 0) || ingredients.length < 1 || steps.length < 1  || keywords.length < 1 }>Save Recipe</button>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
            {isModalIOpen ? <IngredientDialog isOpen={isModalIOpen} onClose={closeModalI} onAdd={addIngredient} onSaveEdited={saveEditedIngredient} editingIngredient={editingIngredient} qt={qt} onQtChange={setQt} unit={unit} onUnitChange={setUnit} ing={ing} onIngChange={setIng}/> : null}
            {isModalSOpen ? <StepDialog isOpen={isModalSOpen} onClose={closeModalS} onAdd={addStep} onSaveEdited={saveEditedStep} editingStep={editingStep} text={text} onTextChange={setText}/> : null}
            {isModalKOpen ? <KeywordDialog isOpen={isModalKOpen} onClose={closeModalK} onAdd={addKeyword}  onSaveEdited={saveEditedKeyword} editingKeyword={editingKeyword} w={w} onWChange={setW}/> : null}
        </div>
    );
}

export { AddRecipe };