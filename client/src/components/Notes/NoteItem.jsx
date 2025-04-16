// ... existing code ...
import { useState } from 'react';
import { useNotes } from '../../context/NotesContext';

export default function NoteItem({ note, onClick }) {
    const { archiveNote, unarchiveNote, deleteNote } = useNotes();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // function getPlainText(html) {
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = html || 'Empty note';
    //     return tempDiv.textContent || tempDiv.innerText || '';
    // }

    return (
        <div
            onClick={onClick}
            className="p-4 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer relative transition-all"
        >
            {/* Actions Dropdown */}
            <div className="absolute top-2 right-2">
                <button
                    onClick={e => {
                        e.stopPropagation();
                        setDropdownOpen((open) => !open);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded shadow"
                    title="Actions"
                >
                    ⋮
                </button>
                {dropdownOpen && (
                    <div
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg z-10"
                        onClick={e => e.stopPropagation()}
                    >
                        {note.isArchived ? (
                            <button
                                onClick={() => {
                                    unarchiveNote(note._id);
                                    setDropdownOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-green-100"
                            >
                                Unarchive
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    archiveNote(note._id);
                                    setDropdownOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-yellow-100"
                            >
                                Archive
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this note?')) {
                                    deleteNote(note._id);
                                }
                                setDropdownOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <h3 className="font-semibold truncate">{note.title}</h3>
            {/* ... existing code ... */}
            {/* <div
                className="text-sm text-gray-500 truncate whitespace-nowrap overflow-hidden"
                style={{ maxWidth: '100%' }}
            >
                {getPlainText(note.content)}
            </div> */}
            <div className="flex space-x-2 mt-2 truncate">
                {note.tags.map(tag => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        #{tag}
                    </span>
                ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
                Last edited: {new Date(note.updatedAt).toLocaleString()}
            </p>
        </div>
    );
}
// ... existing code ...