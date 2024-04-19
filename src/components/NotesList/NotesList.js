import {Loading} from "../Loading/Loading";
import useDeleteRequest from "../../utils/hooks/useDeleteRequest";
import React, { useState, useEffect} from "react";
import './NotesList.css';
import {Button} from "../Button/Button";
import Modal from "../Modal/Modal";
import deleteIcon from "../../assets/delete.svg";
import pinIcon from "../../assets/pin.svg";
import SearchBar from "../SearchBar/SearchBar";

export function NotesList({ notes, selectedNoteId, setSelectedNoteId, loading, seeMoreNotes, setErrorModalOpen, updateNotes }) {
    const {deleteData} = useDeleteRequest("notes");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [pinnedNotes, setPinnedNotes] = useState([]);
    const [hoveredNote, setHoveredNote] = useState(null);


    // Gérer les notes pinned, j'ai mis dans le localStorage j'aurais pu faire côté serveur mais j'ai préféré le faire côté client
    useEffect(() => {
        const pinnedNotes = JSON.parse(localStorage.getItem("pinnedNotes")) || [];
        setPinnedNotes(pinnedNotes);
    }, []);

    // Fonction pour épingler/désépingler une note
    const togglePinNote = (id) => {
        const updatedPinnedNotes = [...pinnedNotes];
        const noteIndex = updatedPinnedNotes.indexOf(id);
        if (noteIndex !== -1) {
            updatedPinnedNotes.splice(noteIndex, 1);
        } else {
            updatedPinnedNotes.push(id);
        }
        setPinnedNotes(updatedPinnedNotes);
        localStorage.setItem("pinnedNotes", JSON.stringify(updatedPinnedNotes));
    };

    // pour gérer l'affichage du pin quand on passe sa souris sur les notes
    const handleMouseEnter = (id) => {
        setHoveredNote(id);
    };

    const handleMouseLeave = () => {
        setHoveredNote(null);
    };

    // Filtrer les notes en fonction du terme de recherche
    const filteredNotes = notes?.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
    ) ?? [];

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
                setSelectedNoteId(null);
                const updatedNotes = notes.filter(note => note.id !== id);
                updateNotes(updatedNotes);
            } else {
                console.error("La suppression de la note a échoué.");
                setErrorModalOpen(true);
            }
        } catch (error) {
            setErrorModalOpen(true);
            console.error("Une erreur s'est produite lors de la suppression de la note :", error);
        }
    };
    return (
        <>
            {loading ? (
                <div className="Loading-wrapper">
                    <Loading />
                </div>
            ) : (
                <>
                    <SearchBar onSearch={handleSearchChange} onChange={handleSearchChange} searchTerm={searchTerm} />

                    {[
                        ...filteredNotes.filter(note => pinnedNotes.includes(note.id)),
                        ...filteredNotes.filter(note => !pinnedNotes.includes(note.id))
                    ].map((note) => (
                        <div
                            className={`Note-button ${selectedNoteId === note.id ? "Note-button-selected" : ""}`}
                            key={note.id}
                            onClick={() => setSelectedNoteId(note.id)}
                            onMouseEnter={() => handleMouseEnter(note.id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className={`jolienote ${note.checked ? "note-checked" : ""}`}>
                                <div>
                                    {note.title && <span className="jolieTitle">{note.title.substring(0, 15)}</span>}
                                    <div className="Note-tags">
                                        {note.tags && note.tags.map((tag, index) => (
                                            <span key={index} className="Tag">{tag.value}</span>
                                        ))}
                                    </div>
                                </div>
                                <span className="joliecontent">{note.content ? note.content.substring(0, 15) + "..." : ""}</span>
                            </div>

                            {(hoveredNote === note.id || pinnedNotes.includes(note.id)) && (
                                <img
                                    src={pinIcon}
                                    alt="Pin"
                                    className="icons"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        togglePinNote(note.id);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                />
                            )}

                            <img
                                src={deleteIcon}
                                alt="Delete"
                                className="icons"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleOpenModal(note.id);
                                }}
                                style={{ cursor: 'pointer' }}
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
                        buttons={['delete']}
                    />
                </>
            )}
        </>
    );
}