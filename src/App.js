import "./App.css";
import {useEffect, useState} from "react";
import SearchBar from './components/SearchBar/SearchBar';
import {NotesList} from "./components/NotesList/NotesList";
import {Note} from "./components/Note/Note";
import usePostRequest from "./utils/hooks/usePostRequest";
import {useGetRequest} from "./utils/hooks/useGetRequest";
import createNoteIcon from "./assets/createNote.svg";


function App() {
    const [notes, setNotes] = useState(null);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const { postData} = usePostRequest("/notes", []);
    const [notesPage , setNotesPages] = useState(1);
    const {data, isLoading, error} = useGetRequest(`/notes?_page=${notesPage}&_limit=10`);


    useEffect(() => {
        if (data) {
            setNotes(data);
        }
    }, [data, notesPage]);

    const createNote = async () => {
        try {
            const responseData = await postData({title: "Nouvelle note", content: "", lastUpdatedAt: new Date()});
            if (responseData) {
                // Mise à jour de la liste des notes avec la nouvelle note ajoutée
                setNotes((prevNotes) => [...prevNotes, responseData]);
                setSelectedNoteId(responseData.id);
            } else {
                console.error("Erreur lors de la création de la note.");
            }
        } catch (error) {
            console.error("Erreur lors de la création de la note :", error);
        }
    };

    const refreshNote = (id, title, content) => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, title, content } : note
            )
        );
    };

    const seeMoreNotes = async () => {
        try {
            setNotes(data);
            setNotesPages(notesPage + 1);
            console.log(notesPage);
        } catch (error) {
            console.error("Erreur lors de la récupération des notes :", error);
        }
    }


    const selectedNote =
        notes && notes.find((note) => note.id === selectedNoteId);

    return (
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
                <SearchBar/>
                <NotesList
                    notes={notes}
                    selectedNoteId={selectedNoteId}
                    setSelectedNoteId={setSelectedNoteId}
                    loading={isLoading}
                    seeMoreNotes={seeMoreNotes}
                />
            </aside>
            <main className="Main">
                {selectedNote ? (
                    <Note
                        id={selectedNote.id}
                        title={selectedNote.title}
                        content={selectedNote.content}
                        onBlur={refreshNote}
                    />
                ) : null}
            </main>
        </>
    );
}

export default App;
