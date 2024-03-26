const RecipeKeywords = (props) =>{
    const words = props.keywords.map((word, i) =>{
        return <li
                    className='recipeform-keyword'
                    data-testid={`keyword-${i}`}
                    key={i}>{word}
                    <button className='editremovebutton' onClick={() => props.onEdit(word)} data-testid={`edit-keyword-${i}`}>Edit keyword</button>
                    <button className='editremovebutton' onClick={() => props.onRemove(word)} data-testid={`remove-keyword-${i}`}>Remove keyword</button>
                </li>
    });

    return(
        <div>
            <ul data-testid="recipeKeywords" className='recipeform-keywords'>{words}</ul>
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
                    <input type='text' className="modalInput" value={w} onChange={(e) => onWChange(e.target.value)} data-testid="keyword-input"/><br/>
                </label>
                {
                    editingKeyword?
                    <button onClick={() => onSaveEdited(w)} disabled={!w} data-testid="savekeywordbutton">Save Keyword</button>:
                    <button onClick={() => onAdd(w)} disabled={!w} data-testid="addkeywordbutton">Add Keyword</button>
                }
            </div>
        </div>
    );
}

export { RecipeKeywords, KeywordDialog };