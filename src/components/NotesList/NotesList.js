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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // État pour stocker le terme de recherche

    // Fonction pour filtrer les notes en fonction du terme de recherche
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Fonction de recherche à appeler lorsque le terme de recherche change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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


    const deleteNote = async (id) => {
        try {
            const success = await deleteData(id);

            if (success) {
                setSelectedNoteId(null); // Désélectionne la note supprimée si elle était sélectionnée
            } else {
                console.error("La suppression de la note a échoué.");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression de la note :", error);
        }
    };

    return (
        <>
            {loading ? (
                <div className="Loading-wrapper">
                    <Loading/>
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        onChange={handleSearchChange}
                    />
                    {filteredNotes.map((note) => (
                        <div
                            className={`Note-button ${selectedNoteId === note.id ? "Note-button-selected" : ""}`}
                            key={note.id}
                            onClick={() => setSelectedNoteId(note.id)}
                        >
                            <div className="jolienote">
                                <div>
                                    {note.title && <span className="jolieTitle">{note.title.substring(0, 15)}</span>}
                                    <div className="Note-tags">
                                        {note.tags && note.tags.map((tag, index) => (
                                            <span key={index} className="Tag">{tag.value}</span>
                                        ))}
                                    </div>
                                </div>
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
