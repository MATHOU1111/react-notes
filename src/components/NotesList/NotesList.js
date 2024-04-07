import {Loading} from "../Loading/Loading";
import useDeleteRequest from "../../utils/hooks/useDeleteRequest";
import React, {useEffect, useState} from "react";
import './NotesList.css';
import {Button} from "../Button/Button";
import Modal from "../Modal/Modal";
import deleteIcon from "../../assets/delete.svg";
import pinIcon from "../../assets/pin.svg";

export function NotesList({notes, selectedNoteId, setSelectedNoteId, loading, seeMoreNotes}) {
    const {deleteData} = useDeleteRequest("notes");
    const [notesList, setNotesList] = useState(notes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [pinnedNotes, setPinnedNotes] = useState([]);
    const [isChecked, setIsChecked] = useState(false);


    // Ouverture de la modale
    const handleOpenModal = (id) => {
        setIsModalOpen(true);
        setNoteToDelete(id);
    };


    // Fermeture de la modale
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNoteToDelete(null);
    };


    const confirmDeleteNote = async () => {
        if (noteToDelete) {
            await deleteNote(noteToDelete);
            handleCloseModal();
        }
    };

    // Gère le changement d'état de la checkbox
    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const deleteNote = async (id) => {
        try {
            const success = await deleteData(id);

            if (success) {
                const updatedNotes = notesList.filter((note) => note.id !== id);
                setNotesList(updatedNotes);
                setSelectedNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
            } else {
                console.error("La suppression de la note a échoué.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression de la note :", error);
        }
    };

    useEffect(() => {
        setNotesList(notes);
        console.log(notes);
    }, [notes]);

    return (
        <>
            {loading ? (
                <div className="Loading-wrapper">
                    <Loading/>
                </div>
            ) : (
                <>
                    {notesList?.map((note) => (
                        <div
                            className={`Note-button ${selectedNoteId === note.id ? "Note-button-selected" : ""}`}
                            key={note.id}
                            onClick={() => setSelectedNoteId(note.id)}
                        >
                            <input
                                type="checkbox"
                                className="Note-Checkbox"
                                onChange={handleCheckboxChange}
                                checked={isChecked}
                            />
                            <div className="jolienote">
                                <span className="jolieTitle">{note.title.substring(0, 15)}</span>
                                <span
                                    className="joliecontent">{note.content ? note.content.substring(0, 15) + "..." : ""}</span>
                            </div>
                            <img
                                src={pinIcon}
                                alt="Pin"
                                className="icons"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    console.log("Pinned note with ID", note.id + "Pine ta mere !");
                                }}
                                style={{cursor: 'pointer'}}
                            />
                            <img
                                src={deleteIcon}
                                alt="Delete"
                                className="icons"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenModal(note.id);
                                }}
                                style={{cursor: 'pointer'}}
                            />
                        </div>
                    ))}
                    <Button onClick={seeMoreNotes}>Voir plus de notes</Button>

                    <Modal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        confirmDeleteNote={confirmDeleteNote}
                        title={"Etes vous sûre de vouloir supprimer cette note ?"}
                        secondTitle={"Cette action est irréversible ! "}
                    />
                </>
            )}
        </>
    );
}
