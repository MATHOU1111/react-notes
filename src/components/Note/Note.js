import React, {useState, useEffect, useRef} from "react";
import "./Note.css";
import {Loading} from "../Loading/Loading";
import done from '../../assets/checked.svg';
import usePutRequest from "../../utils/hooks/usePutRequest";
import {Divider} from "../Divider/divider";
import ReactMarkdown from 'react-markdown';

export function Note({Note, onBlur, refreshNote, setErrorModalOpen}) {
    const currentNoteIdRef = useRef(Note.id);
    const [title, setTitle] = useState(Note.title);
    const [content, setContent] = useState(Note.content);
    const [checked, setChecked] = useState(Note.checked);
    const [tags, setTags] = useState(Note.tags);
    const [loading, setLoading] = useState(null);
    const [markdownEnabled, setMarkdownEnabled] = useState(false); // State pour suivre si le Markdown est activé

    const {putData} = usePutRequest();

    useEffect(() => {
        setTitle(Note.title);
        setContent(Note.content);
        if (currentNoteIdRef.current !== Note.id) {
            currentNoteIdRef.current = Note.id;
            setLoading(null);
        }
        setChecked(Note.checked);
        setTags(Note.tags);
    }, [Note]);

    const updateNote = async () => {
        setLoading(true);
        try {
            await putData(`/notes/${Note.id}`, {
                title,
                content,
                lastUpdatedAt: new Date(),
                checked,
                tags,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error updating note:", error);
            setErrorModalOpen(true);
            setLoading(false);
        }
    };

    const handleTitleChange = (event) => {
        setLoading(null);
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setLoading(null);
        setContent(event.target.value);
    };

    const handleBlur = (event) => {
        onBlur(Note.id, title, content, checked, tags);
        event.preventDefault();
        updateNote();
    };

    const handleRemoveTag = (tagIdToRemove) => {
        const updatedTags = tags.filter((tag) => tag.id !== tagIdToRemove);
        setTags(updatedTags);
        refreshNote(Note.id, title, content, checked, updatedTags);
        updateNote();
    };

    const handleTagInput = (event) => {
        if (event.key === " ") {
            const newTag = {
                value: event.target.value.trim(),
                id: Math.floor(Math.random() * 1000),
            };
            if (newTag.value !== "") {
                setTags([...tags, newTag]);
                updateNote();
                event.target.value = "";
            }
        }
    };

    const handleCheckboxChange = (event) => {
        const isChecked = event.target.checked;
        setChecked(isChecked);
        updateNote();
    };

    const toggleMarkdown = (event) => {
        event.preventDefault(); // Empêcher le rechargement de la page
        setMarkdownEnabled(!markdownEnabled);
    };

    const options = {year: "numeric", month: "2-digit", day: "2-digit", hour: "numeric", minute: "numeric",};
    const formattedLastUpdatedAt = new Date(Note.lastUpdatedAt).toLocaleString("fr-FR", options);

    return (
        <form className="Form" onBlur={handleBlur}>
            <div className="Note-header">
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleCheckboxChange}
                    />
                </div>
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
                    placeholder={"Ajouter des tags.."}
                    onKeyDown={handleTagInput}
                />
            </div>
            <div className="Note-tags">
                {tags &&
                    tags.map((tag) => (
                        <span key={tag.id} className="Tag">
                        {tag.value}
                            <button type="button" onClick={() => handleRemoveTag(tag.id)}>X</button>
                    </span>
                    ))}
            </div>
            <div>
                <button onClick={toggleMarkdown}>Activer Markdown</button>
            </div>
            <Divider/>
            {markdownEnabled ? (
                <div className="Note-content Markdown-content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            ) : (
                <textarea
                    className="Note-editable Note-content"
                    placeholder={"Contenu de la note..."}
                    value={content}
                    onChange={handleContentChange}
                    onClick={handleContentChange}
                />
            )}
            <Divider/>
            <div className="Note-footer">
            <span className="Note-last-updated">
                Dernière modification le {formattedLastUpdatedAt}
            </span>
                {loading === true && (
                    <span className="Saving">
                    <Loading/> Enregistrement...
                </span>
                )}
                {loading === false && (
                    <span className="Saved">
                    <img src={done} alt="done"/> Changements sauvegardés
                </span>
                )}
            </div>
        </form>
    );
}
