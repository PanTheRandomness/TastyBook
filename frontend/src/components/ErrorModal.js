const ErrorModal = ({ isOpen, onClose, errortext}) =>{
    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2 className='modal-header'>Error:</h2>
                <p className='modal-text'>{errortext}</p>
                <button onClick={() => onClose()} data-testid='cancele-button'>Ok</button>
            </div>
        </div>
    );
}

export default ErrorModal;