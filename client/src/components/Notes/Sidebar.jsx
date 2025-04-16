import { useAuth } from '../../context/AuthContext';
import { useNotes } from '../../context/NotesContext';

import logo from "../../assets/Designer.png"
import { FaHome } from "react-icons/fa";
import { FaTag } from "react-icons/fa6";
import { IoIosArchive } from "react-icons/io";
import { IoMdClose } from "react-icons/io";
import { CiLogout } from "react-icons/ci";

export default function Sidebar({ isOpen = false, onClose }) {
    const { logout } = useAuth();
    const { tags, setFilter } = useNotes();

    // Sidebar drawer for mobile/tablet
    return (
        <div>
            {/* Overlay and drawer for mobile/tablet */}
            <div
                className={`
                    fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity
                    ${isOpen ? 'block lg:hidden' : 'hidden'}
                `}
                onClick={onClose}
            />
            <div
                className={`
                    fixed top-0 left-0 z-50 h-full w-60 bg-zinc-200 text-black p-4 overflow-y-auto shadow-lg transition-transform
                    ${isOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    lg:static lg:block lg:shadow-none lg:bg-zinc-200
                `}
                style={{ transition: 'transform 0.3s' }}
            >
                {/* Close button for mobile/tablet */}
                <button
                    className="lg:hidden absolute top-4 right-4 text-2xl"
                    onClick={onClose}
                    aria-label="Close sidebar"
                >
                    <IoMdClose />
                </button>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <div className='flex gap-4 items-center'>
                            <img src={logo} alt="logo" className='w-14' />
                            <p className='text-3xl'>Notely</p>
                        </div>
                        <div className='flex flex-col gap-2 my-4'>
                            <button
                                onClick={() => { setFilter('all'); onClose && onClose(); }}
                                className="w-full text-left p-2 hover:bg-gray-300 transition-all rounded flex items-center"
                            >
                                <FaHome className='inline-block mr-2' />
                                All Notes
                            </button>
                            <button
                                onClick={() => { setFilter('archived'); onClose && onClose(); }}
                                className="w-full text-left p-2 hover:bg-gray-300 transition-all rounded flex items-center"
                            >
                                <IoIosArchive className='inline-block mr-2' />
                                Archived Notes
                            </button>
                        </div>
                        <div className='bg-zinc-500 rounded-full w-full h-0.5 mb-4' />
                        <p className='text-zinc-500 text-sm mb-2 pl-2'>Tag Filter:</p>
                        <div className='flex flex-col gap-2'>
                            {tags.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setFilter(tag); onClose && onClose(); }}
                                    className="w-full text-left p-2 hover:bg-gray-300 transition-all rounded flex items-center"
                                >
                                    <FaTag className='inline-block mr-2' />
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className='bg-zinc-500 rounded-full w-full h-0.5 mb-2' />
                        <button
                            onClick={logout}
                            className="w-full text-left p-2 hover:bg-gray-300 transition-all rounded"
                        >
                            <CiLogout className='inline-block mr-2' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}