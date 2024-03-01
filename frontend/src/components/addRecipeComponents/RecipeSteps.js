const RecipeSteps = (props) =>{
    const steps = props.steps.map((step, i) =>{
        return <li
                    key={i}
                    className="recipeform-step"
                    data-testid={`step-${i}`}>{step}
                    <button className='editremovebutton' onClick={() => props.onEdit(step)}>Edit step</button>
                    <button className='editremovebutton' onClick={() => props.onRemove(step)}>Remove step</button>
                </li>
    });

    return(
        <div className='recipeform-steps'>
            <ol data-testid="recipeSteps">{steps}</ol>
        </div>
    );
}

const StepDialog = ({ isOpen, onClose, onAdd, onSaveEdited, editingStep, text, onTextChange }) =>{
    
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <label>
                    <b className="modal-text">Type instructions:</b><br/>
                    <textarea rows="10" cols="55" className="modalInput" value={text} onChange={(e) => onTextChange(e.target.value)}/><br/>
                </label>
                {
                    editingStep ? 
                    <button onClick={() => onSaveEdited(text)} disabled={!text}>Save Step</button>:
                    <button onClick={() => onAdd(text)} disabled={!text}>Add Step</button>
                }
            </div>
        </div>
    );
}

export { RecipeSteps, StepDialog };