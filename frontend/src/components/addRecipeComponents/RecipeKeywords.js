const RecipeKeywords = (props) =>{
    const words = props.keywords.map((word, i) =>{
        return <li
                    className='recipeform-keyword'
                    data-testid={`keyword-${i}`}
                    key={i}>{word}
                    <button className='editremovebutton' onClick={() => props.onEdit(word)}>Edit keyword</button>
                    <button className='editremovebutton' onClick={() => props.onRemove(word)}>Remove keyword</button>
                </li>
    });

    return(
        <div>
            <ul className='recipeform-keywords'>{words}</ul>
        </div>
    );
}

const KeywordDialog =({ isOpen, onClose, onAdd, onSaveEdited, editingKeyword, w, onWChange }) =>{

    return(
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <label>
                    <b className="modal-text">Type keyword:</b>
                    <input type='text' className="modalInput" value={w} onChange={(e) => onWChange(e.target.value)}/><br/>
                </label>
                {
                    editingKeyword?
                    <button onClick={() => onSaveEdited(w)} disabled={!w}>Save Keyword</button>:
                    <button onClick={() => onAdd(w)} disabled={!w}>Add Keyword</button>
                }
            </div>
        </div>
    );
}

export { RecipeKeywords, KeywordDialog };