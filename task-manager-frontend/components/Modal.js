import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, message }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-[#210F37]">Error</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-[#A55B4B] focus:outline-none"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-black">{message}</p>
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-[#210F37] text-white rounded-md hover:bg-[#4F1C51] focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:ring-offset-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 