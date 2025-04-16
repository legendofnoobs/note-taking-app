import { useState } from 'react';
import { useNotes } from '../../context/NotesContext';
import NoteItem from './NoteItem';

import api from '../../utils/api';

export default function NoteList() {
    const { notes, filter, setSelectedNote, fetchNotes } = useNotes();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNotes = notes.filter(note => {
        if (filter === 'all') return !note.isArchived; // Only show unarchived notes in "all"
        if (filter === 'archived') return note.isArchived;
        return note.tags.includes(filter);
    });

    const handleCreateNote = async () => {
        // Add detailed logging
        console.log('Local Storage:', localStorage);
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        if (!token) {
            console.warn('No token found in localStorage, redirecting to login');
            window.location.href = '/login';
            return;
        }

        try {
            // Verify the token is being sent in the request
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const response = await api.post('/notes', {
                title: 'new note',
                content: 'Default content', // Provide default content
                tags: []
            }, config);

            setSelectedNote(response.data);
            fetchNotes();
        } catch (error) {
            console.error('Error details:', error);
            if (error.response?.status === 401) {
                console.log('Token expired or invalid, redirecting to login');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                console.error('Error creating note:', error);
            }
        }
    };

    const searchedNotes = filteredNotes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let tabName = "Notes";
    if (filter === "all") tabName = "All Notes";
    else if (filter === "archived") tabName = "Archived Notes";
    else tabName = `#${filter}`;

    return (
        <div className="w-80 bg-gray-100 h-screen p-4 pb-96 lg:pb-4 overflow-y-auto">
            <div className="flex flex-col bg-gray-100">
                <div className='flex items-center justify-between mb-4'>
                    <h2 className="text-xl font-semibold">{tabName}</h2>
                    <button
                        onClick={handleCreateNote}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
                    >
                        + New Note
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className='bg-zinc-500 rounded-full w-full h-0.5 mb-4' />
            <div className="space-y-2">
                {searchedNotes.map(note => (
                    <NoteItem
                        key={note._id}
                        note={note}
                        onClick={() => setSelectedNote(note)}
                    />
                ))}
            </div>
        </div>
    );
}