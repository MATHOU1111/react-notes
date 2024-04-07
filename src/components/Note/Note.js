import React, { useState, useEffect, useRef } from "react";
import "./Note.css";
import { Loading } from "../Loading/Loading";
import done from '../../assets/checked.svg';
import usePutRequest from "../../utils/hooks/usePutRequest";

export function Note({ id, title: initialTitle, content: initialContent, onBlur }) {
    const currentNoteIdRef = useRef(id);
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [loading, setLoading] = useState(null);
    const { putData } = usePutRequest();

    useEffect(() => {
        setTitle(initialTitle);
        setContent(initialContent);
        if(currentNoteIdRef.current !== id) {
            currentNoteIdRef.current = id;
            setLoading(null);
        }
    }, [id, initialTitle, initialContent]);

    const updateNote = async () => {
        setLoading(true);
        try {
            // Fonction importée via le hook usePutRequest
            await putData(`/notes/${id}`, {title, content, lastUpdatedAt: new Date(),});
            setLoading(false);
            } catch (error) {
            console.error("Error updating note:", error);
            setLoading(false);
        }
    };

    // Déclenche updateNote à chaque changement de titre ou de contenu
    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleBlur = (event) => {
        onBlur(id, title, content); // Appel de la fonction onBlur passée en props
        event.preventDefault();
        updateNote();
    };

    return (
        <form className="Form" onBlur={handleBlur}>
            <input
                className="Note-editable Note-title"
                type="text"
                value={title}
                onChange={handleTitleChange}
            />
            <textarea
                className="Note-editable Note-content"
                value={content}
                onChange={handleContentChange}
            />
            {loading === true && (
                <span className="Saving">Enregistrement<Loading/></span>
            )}
            {loading === false && (
                <span className="Saving">Changements sauvegardés <img src={done} alt="done" /></span>
            )}
            {loading === null && (
                <span></span>
            )}
        </form>
    );
}
