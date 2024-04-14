import "./App.css";
import {useEffect, useState} from "react";
import {NotesList} from "./components/NotesList/NotesList";
import {Note} from "./components/Note/Note";
import usePostRequest from "./utils/hooks/usePostRequest";
import {useGetRequest} from "./utils/hooks/useGetRequest";
import createNoteIcon from "./assets/createNote.svg";
import Modal from "./components/Modal/Modal";

function App() {
    const [notes, setNotes] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [errorModalOpen, setErrorModalOpen] = useState(false);
    const { postData} = usePostRequest("/notes", []);
    const [notesPage , setNotesPages] = useState(1);
    const {data, isLoading, error} = useGetRequest(`/notes?_page=${notesPage}&_limit=10`);


    useEffect(() => {
        if (data) {
            const sortedData = [...data].sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));
            setNotes(sortedData);
        }
        if(error){
            setErrorModalOpen(true);
        }
    }, [data, notesPage]);


    const createNote = async () => {
        try {
            const responseData = await postData({title: "Nouvelle note", content: "", lastUpdatedAt: new Date().toISOString(), checked: false, tags: [] });
            if (responseData) {
                setNotes((prevNotes) => [responseData, ...prevNotes]);
                setSelectedNoteId(responseData.id);
            }else {
                console.error("La création de la note a échoué");
                setErrorModalOpen(true);
            }
        } catch (error) {
            setErrorModalOpen(true);
        }
    };

    const refreshNote = (id, title, content, checked, tags) => {
        const updatedNoteIndex = notes.findIndex(note => note.id === id);
        if (updatedNoteIndex !== -1) {
            const updatedNote = { ...notes[updatedNoteIndex], title, content, lastUpdatedAt: new Date().toISOString(), checked, tags };

            const updatedNotes = [...notes];
            updatedNotes[updatedNoteIndex] = updatedNote;

            // Trier les notes par lastUpdatedAt en ordre décroissant
            updatedNotes.sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt));

            setNotes(updatedNotes);
        }
    };

    const seeMoreNotes = async () => {
        try {
            setNotes(data);
            setNotesPages(notesPage + 1);
            console.log(notesPage);
        } catch (error) {
            console.error("Erreur lors de la récupération des notes :", error);
            setErrorModalOpen(true);
        }
    }


    const selectedNote =
        notes && notes.find((note) => note.id === selectedNoteId);

    return (
        <>
            {errorModalOpen && (
                <Modal
                    isOpen={errorModalOpen}
                    onClose={() => setErrorModalOpen(false)}
                    title="Erreur"
                    secondTitle="Une erreur s'est produite, Veuillez réessayer."
                />
            )}
            {error ? (
                <div className="error-message">
                    Une erreur s'est produite lors du chargement, réessayez plus tard ! 🤯
                </div>
            ) : (
                <>
                    <aside className="Side">
                        <div className="Create-note-wrapper">
                            <img
                                src={createNoteIcon}
                                alt="create"
                                className="icon"
                                style={{cursor: 'pointer'}}
                            />
                            <h2 className="Create-note-title">Notes</h2>
                            <img
                                src={createNoteIcon}
                                alt="create"
                                className="icon"
                                onClick={createNote}
                                style={{cursor: 'pointer'}}
                            />
                        </div>

                        <NotesList
                            notes={notes}
                            selectedNoteId={selectedNoteId}
                            setSelectedNoteId={setSelectedNoteId}
                            loading={isLoading}
                            seeMoreNotes={seeMoreNotes}
                            setErrorModalOpen={setErrorModalOpen}
                        />
                    </aside>
                    <main className="Main">
                        {selectedNote ? (
                            <Note
                                Note={selectedNote}
                                onBlur={refreshNote}
                                refreshNote={refreshNote}
                                setErrorModalOpen={setErrorModalOpen}
                            />
                        ) : null}
                    </main>
                </>
            )}
        </>
    );
}

export default App;
