import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

// eslint-disable-next-line react-refresh/only-export-components
export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedNote, setSelectedNote] = useState(null);
    const [tags, setTags] = useState([]);
    const { isAuthenticated } = useAuth();

    const fetchNotes = async () => {
        if (!isAuthenticated) return;

        try {
            const response = await api.get('/notes');
            setNotes(response.data);
            extractTags(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const extractTags = (notes) => {
        const allTags = notes.flatMap(note => note.tags);
        const uniqueTags = [...new Set(allTags)];
        setTags(uniqueTags);
    };

    const updateNote = async (updatedNote) => {
        try {
            await api.put(`/notes/${updatedNote._id}/autosave`, updatedNote);
            setNotes(prev => prev.map(n => n._id === updatedNote._id ? updatedNote : n));
        } catch (error) {
            console.error(error);
        }
    };

    const archiveNote = async (noteId) => {
        try {
            await api.patch(`/notes/${noteId}/archive`);
            // Optionally, update local state to remove or update the archived note
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === noteId ? { ...note, isArchived: true } : note
                )
            );
        } catch (error) {
            console.error('Failed to archive note:', error);
        }
    }; // <-- This closing brace was missing

    const unarchiveNote = async (noteId) => {
        try {
            await api.patch(`/notes/${noteId}/unarchive`);
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note._id === noteId ? { ...note, isArchived: false } : note
                )
            );
        } catch (error) {
            console.error('Failed to unarchive note:', error);
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await api.delete(`/notes/${noteId}`);
            setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <NotesContext.Provider value={{
            notes,
            filter,
            setFilter,
            selectedNote,
            setSelectedNote,
            tags,
            updateNote,
            fetchNotes,
            archiveNote,
            unarchiveNote,
            deleteNote
        }}>
            {children}
        </NotesContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};