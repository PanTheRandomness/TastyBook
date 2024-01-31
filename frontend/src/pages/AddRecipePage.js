import { useState, useEffect } from 'react';
import { RecipeIngredients, RecipeSteps } from './RecipePage';
import '../Modal.css';
//myös muokkaus

const AddRecipe = () =>{
    const [recipeId,setRecipeId] = useState(1);
    const [name, setName] = useState('');
    const [durationH, setDurationH] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [image, setImage] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [ingredient, setIngredient] = useState({});
    const [steps, setSteps] = useState([]);
    const [visibleToAll, setVisibleToAll] = useState(true);

    const [isModalIOpen, setModalIOpen] = useState(false);
    const [isModalSOpen, setModalSOpen] = useState(false);

    const openModalI = () => setModalIOpen(true);
    const closeModalI = () => setModalIOpen(false);
    const openModalS = () => setModalSOpen(true);
    const closeModalS = () => setModalSOpen(false);

    const saveBtnClicked = () =>{

    }

    return(
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Recipe name:</th>
                        <td><input type='text' value={name} onChange={(e) => setName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Visibility:</th>
                        <td>
                            <label>
                                <input type='radio' /> Public
                            </label><br/>
                            <label>
                                <input type='radio' /> Registered only
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>Recipe duration:</th>
                        <td>
                            <label>
                                <input type='number' value={durationH} min="0" max="200" onChange={(e) => setDurationH(e.target.value)} /> hours 
                            </label> <br/>
                            <label>
                                <input type='number' value={durationMin} min="0" max="59" onChange={(e) => setDurationMin(e.target.value)} /> minutes
                            </label>
                        </td>
                    </tr>
                    <tr>
                        <th>Image:</th>
                        <td>
                            <input type='file' value={image} accept="image/*" onChange={(e) => setImage(e.target.value)}/>
                        </td>
                    </tr>
                    <tr>
                        <th>Ingredients:</th>
                        <td>
                            {ingredients.length < 1 ? null : <RecipeIngredients ingredients={ingredients} />}
                        </td>
                        <td><button onClick={openModalI}>Add</button></td>
                    </tr>
                    <tr>
                        <th>Steps:</th>
                        <td>
                            {steps.length < 1 ? null : <RecipeSteps steps={steps} />}
                        </td>
                        <td><button onClick={openModalS}>Add</button></td>
                    </tr>
                    <tr>
                        <th></th>
                        <td>
                            <button onClick={saveBtnClicked}>Save Recipe</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            {isModalIOpen ? <IngredientDialog isOpen={isModalIOpen} onClose={closeModalI} /> : null}
            {isModalSOpen ? <StepDialog isOpen={isModalSOpen} onClose={closeModalS} /> : null}
        </div>
    );
};


const IngredientDialog = ({ isOpen, onClose }) =>{
    console.log();
    
    const [unitlist, setUnitlist] = useState(["whole", "cloves","kg", "g", "l", "dl", "cl", "ml", "tsp", "tbsp", "cups"]);
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
                                <input type='number'/>
                                <select>{units}</select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ingredient:</td>
                            <td><input type='text' /*value={ingredient} onChange={(e)=>setIngredient}*//></td>
                        </tr>
                    </tbody>
                </table>
          </div>
        </div>
      );
};

const StepDialog = ({ isOpen, onClose }) =>{
    
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={onClose}>&times;</span>
            <p>Modal Dialog 2 Content</p>
          </div>
        </div>
      );
};

export {AddRecipe};