import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Notes/Sidebar';
import NoteList from '../components/Notes/NoteList';
import NoteEditor from '../components/Notes/NoteEditor';
import { Link } from 'react-router-dom';

import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

export default function Home() {
    const { user, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex flex-col justify-center items-center h-screen">
            <p>
                Please login to access your notes
            </p>
            <Link to="/login" className='text-blue-500 underline'>Login</Link>
        </div>;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden lg:flex-row">
            <div className="lg:hidden flex items-center p-2 bg-white shadow z-20">
                <button
                    className="mr-2"
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Open navigation"
                >
                    <FaBars size={24} />
                </button>
                <span className="font-bold text-lg">Notely</span>
            </div>
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen || window.innerWidth >= 1024} onClose={() => setSidebarOpen(false)} />
            <div className='flex w-full h-svh'>
                <NoteList />
                <NoteEditor />
            </div>
        </div>
    );
}