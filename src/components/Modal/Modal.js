import './Modal.css';

function Modal({ isOpen, onClose, confirmDeleteNote, title, secondTitle, buttons }) {
    if (!isOpen) return null;

    const showDeleteButton = buttons && buttons.includes('delete');

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-button" onClick={onClose}>X</button>
                <div className="title">
                    <h2>{title}</h2>
                    {secondTitle}
                </div>
                <div className="button-container">
                    {showDeleteButton && (
                        <button className="confirm-button" onClick={confirmDeleteNote}>Supprimer</button>
                    )}
                    <button className="cancel-button" onClick={onClose}>Fermer</button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
