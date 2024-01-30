import { useState, useEffect } from 'react';
import { RecipeIngredients, RecipeSteps } from './RecipePage';
//myös muokkaus

const AddRecipe = () =>{
    const [recipeId,setRecipeId] = useState(1);
    const [name, setName] = useState('');
    const [creator, setCreator] = useState('');
    const [durationH, setDurationH] = useState(0);
    const [durationMin, setDurationMin] = useState(0);
    const [image, setImage] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [ingredient, setIngredient] = useState({});
    const [steps, setSteps] = useState([]);
    const [visibleToAll, setVisibleToAll] = useState(true);
    const [created, setCreated] = useState('');
    const [modified, setModified] = useState('');

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
                            <input type='file' value={image} />
                        </td>
                    </tr>
                    <tr>
                        <th>Ingredients:</th>
                        <td>
                            {ingredients.length < 1 ? null : <RecipeIngredients ingredients={ingredients} />}
                            <AddIngredient />
                        </td>
                    </tr>
                    <tr>
                        <th>Steps:</th>
                        <td>
                            {steps.length < 1 ? null : <RecipeSteps steps={steps} />}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

const AddIngredient = (props) =>{
    return(
        <table></table>
    );
}

const AddStep = (props) =>{
    return(
        <table></table>
    );
}

export {AddRecipe, AddIngredient, AddStep};