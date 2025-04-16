// import MDEditor from '@uiw/react-md-editor';
import { Editor } from 'primereact/editor';

import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useNotes } from '../../context/NotesContext';
import { IoMdClose } from 'react-icons/io';

// ... existing code ...
export default function NoteEditor() {
    const { selectedNote, updateNote, setSelectedNote } = useNotes();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tagsInput, setTagsInput] = useState('');
    const [isEditingTags, setIsEditingTags] = useState(false);
    const debouncedContent = useDebounce(content, 1000);

    useEffect(() => {
        if (selectedNote) {
            setContent(selectedNote.content);
            setTitle(selectedNote.title);
            setTagsInput(selectedNote.tags.join(', '));
        }
    }, [selectedNote]);

    useEffect(() => {
        if (selectedNote && debouncedContent) {
            updateNote({
                ...selectedNote,
                content: debouncedContent
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedContent]);

    if (!selectedNote) return null;

    const handleTitleSave = () => {
        setIsEditingTitle(false);
        if (title !== selectedNote.title) {
            updateNote({
                ...selectedNote,
                title
            });
        }
    };

    const handleTagsSave = () => {
        setIsEditingTags(false);
        const newTags = tagsInput
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
        if (JSON.stringify(newTags) !== JSON.stringify(selectedNote.tags)) {
            updateNote({
                ...selectedNote,
                tags: newTags
            });
            // Immediately update tagsInput and selectedNote.tags for instant UI feedback
            setTagsInput(newTags.join(', '));
            selectedNote.tags = newTags; // This line updates the reference for immediate UI update
        }
    };

    return (
        <div className="flex-1 flex flex-col p-4 bg-white shadow-md rounded-lg w-full">
            <button
                onClick={() => setSelectedNote(null)}
                className="bg-red-500 w-fit hover:bg-red-700 transition-all text-gray-700 rounded p-2 text-sm font-semibold shadow absolute top-16 lg:top-2 right-2"
            >
                <IoMdClose className='text-white'/>
            </button>
            {isEditingTitle ? (
                <input
                    className="text-2xl font-bold mb-4 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    value={title}
                    autoFocus
                    onChange={e => setTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleTitleSave();
                    }}
                />
            ) : (
                <h1
                    className="text-2xl font-bold mb-4 cursor-pointer"
                    onClick={() => setIsEditingTitle(true)}
                    title="Click to edit title"
                >
                    {title}
                </h1>
            )}
            {/* Editable tags */}
            {isEditingTags ? (
                <input
                    className="mb-4 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    value={tagsInput}
                    autoFocus
                    placeholder="Enter tags separated by commas"
                    onChange={e => setTagsInput(e.target.value)}
                    onBlur={handleTagsSave}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleTagsSave();
                    }}
                />
            ) : (
                <div
                    className="flex flex-wrap gap-2 mb-4 cursor-pointer w-full"
                    title="Click to edit tags"
                    onClick={() => setIsEditingTags(true)}
                >
                    {selectedNote.tags.length === 0 ? (
                        <span className="text-gray-400">No tags (click to add)</span>
                    ) : (
                        selectedNote.tags.map(tag => (
                            <span key={tag} className="bg-blue-500 text-white px-2 py-1 rounded">
                                #{tag}
                            </span>
                        ))
                    )}
                </div>
            )}
            <p className="text-gray-500 mb-4">
                Last edited: {new Date(selectedNote.updatedAt).toLocaleString()}
            </p>
            <div className="flex-1 h-svh flex flex-col overflow-y-hidden">
                <Editor
                    value={content}
                    onTextChange={e => setContent(e.htmlValue)}
                    className="w-full h-5/6 p-editor-content"
                />
            </div>
        </div>
    );
}
// ... existing code ...