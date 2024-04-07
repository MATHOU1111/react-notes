import './Modal.css';

function Modal({isOpen, onClose, confirmDeleteNote, title, secondTitle}) {
    if (!isOpen) return null;


    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="title">
                    <h2>{title}</h2>
                    {secondTitle}
                </div>
                <div className="button-container">
                    <button className="confirm-button" onClick={confirmDeleteNote}>Supprimer</button>
                    <button className="cancel-button" onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
