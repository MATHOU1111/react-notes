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

    // On appelle le hook pour la modification des requêtes en PUT
    const {putData} = usePutRequest();


    // A chaque fois qu'on change de note on vient refresh les données via un useEffect avec dépendance Note
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


    // Update de la note côté serveur
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

    // Fonction pour gérer le changement de titre
    const handleTitleChange = (event) => {
        setLoading(null);
        setTitle(event.target.value);
    };
    // Fonction pour gérer le changement de content
    const handleContentChange = (event) => {
        setLoading(null);
        setContent(event.target.value);
    };
    // Lorsque l'utilisateur déselectionne les inputs ça enregistre automatiquement aulieu de cliquer sur un bouton
    const handleBlur = (event) => {
        onBlur(Note.id, title, content, checked, tags);
        event.preventDefault();
        updateNote();
    };

    // fonction pour supprimer les tags
    const handleRemoveTag = (tagIdToRemove) => {
        const updatedTags = tags.filter((tag) => tag.id !== tagIdToRemove);
        setTags(updatedTags);
        refreshNote(Note.id, title, content, checked, updatedTags);
        updateNote();
    };


    // Fonction pour ajouter des tags, lorsqu'on appuie sur espace ça ajoute à la liste
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

    // Bouton pour gérer le markdown on/off
    const toggleMarkdown = (event) => {
        setMarkdownEnabled(event.target.checked);
    };

    // On vient formater la date au bon format pour l'afficher
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
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={markdownEnabled}
                        onChange={toggleMarkdown}
                    />
                    <span className="slider round"></span>
                </label>
                <span> Activer Markdown</span>
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
