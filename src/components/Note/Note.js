import React, { useState, useEffect, useRef } from "react";
import "./Note.css";
import { Loading } from "../Loading/Loading";
import done from '../../assets/checked.svg';
import usePutRequest from "../../utils/hooks/usePutRequest";

export function Note({Note, onBlur , checked : initialChecked}) {
    const currentNoteIdRef = useRef(Note.id);
    const [title, setTitle] = useState(Note.title);
    const [content, setContent] = useState(Note.content);
    const [loading, setLoading] = useState(null);

    const { putData } = usePutRequest();

    useEffect(() => {
        console.log(Note);
        setTitle(Note.title);
        setContent(Note.content);
        if (currentNoteIdRef.current !== Note.id) {
            currentNoteIdRef.current = Note.id;
            setLoading(null);
        }
    }, [Note.id, Note.title, Note.content]);

    const updateNote = async () => {
        setLoading(true);
        try {
            // Fonction importée via le hook usePutRequest
            await putData(`/notes/${Note.id}`, { title, content, lastUpdatedAt: new Date() });
            setLoading(false);
        } catch (error) {
            console.error("Error updating note:", error);
            setLoading(false);
        }
    };

    // Déclenche updateNote à chaque changement de titre ou de contenu
    const handleTitleChange = (event) => {
        setLoading(null)
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setLoading(null)
        setContent(event.target.value);
    };

    const handleBlur = (event) => {
        onBlur(Note.id, title, content); // Appel de la fonction onBlur passée en props
        event.preventDefault();
        updateNote();
    };

    // Formatage de la date de dernière modification
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "numeric"
    };
    const formattedLastUpdatedAt = new Date(Note.lastUpdatedAt).toLocaleString("fr-FR", options);


    return (
        <form className="Form" onBlur={handleBlur}>
            <div className="Note-header">
                <input
                    className="Note-editable Note-title"
                    type="text"
                    placeholder={"Titre de la note"}
                    value={title}
                    onChange={handleTitleChange}
                />
                <input
                    className="Note-editable Note-title"
                    type="text"
                    value={null}
                    placeholder={"Ajouter des tags.."}
                    onChange={handleTitleChange}
                />
            </div>
            <textarea
                className="Note-editable Note-content"
                value={content}
                onChange={handleContentChange}
            />
            <div className="Note-footer">
                <span className="Note-last-updated">Dernière modification le {formattedLastUpdatedAt}</span>
                {loading === true && (
                    <span className="Saving"><Loading /> Enregistrement...</span>
                )}
                {loading === false && (
                    <span className="Saved"><img src={done} alt="done" /> Changements sauvegardés</span>
                )}
            </div>
        </form>
    );
}
