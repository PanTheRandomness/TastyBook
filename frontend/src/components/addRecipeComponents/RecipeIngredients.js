const RecipeIngredients = (props) => {
    const ingredientList = props.ingredients.map((ing, i) => {
        return <tr
            key={i}
            className='recipeform-ingredient'
            data-testid={`ingredient-${i}`}>
            <td><b>{ing.quantity} {ing.unit}</b>{ing.name}</td>
            <td>
                <button className='editremovebutton' data-testid={`edit-ingredient-${i}`} onClick={() => props.onEdit(ing)}>Edit ingredient</button>
                <button className='editremovebutton' data-testid={`remove-ingredient-${i}`} onClick={() => props.onRemove(ing)}>Remove ingredient</button>
            </td>
        </tr>
    });

    return (
        <table data-testid="recipeIngredients" className='recipeform-ingredients'>
            <tbody>{ingredientList}</tbody>
        </table>
    );
}

const IngredientDialog = ({ isOpen, onClose, onAdd, onSaveEdited, editingIngredient, qt, onQtChange, unit, onUnitChange, ing, onIngChange }) => {
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                {
                    editingIngredient ?
                        <h3 className='modal-header' data-testid='ingredient-dialog-title'> Modify ingredient</h3> :
                        <h3 className='modal-header' data-testid='ingredient-dialog-title'> Add ingredient</h3>
                }
                <table>
                    <tbody>
                        <tr>
                            <td className="modal-text">Quantity:</td>
                            <td><input type='number' className="modalInput" value={qt} min="0" data-testid="quantityInput" onChange={(e) => onQtChange(e.target.value)} /></td>
                            <td className='modal-text'>Unit:</td>
                            <td><input type='text' value={unit} className="modalInput" data-testid="unitInput" onChange={(e) => onUnitChange(e.target.value)} /></td>
                        </tr>
                        <tr>
                            <td className='modal-text'>Ingredient:</td>
                            <td><input type='text' className="modalInput" value={ing} data-testid="ingredientInput" onChange={(e) => onIngChange(e.target.value)} /></td>
                        </tr>
                    </tbody>
                </table>
                {
                    editingIngredient ?
                        <button onClick={() => onSaveEdited()} disabled={!ing} data-testid='saveIngredient-button'>Save Ingredient</button> :
                        <button onClick={() => onAdd(qt, unit, ing)} disabled={qt == 0 || !ing} data-testid='addIngredient-button'>Add ingredient</button>
                }
            </div>
        </div>
    );
}

export { RecipeIngredients, IngredientDialog };