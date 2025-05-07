import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children, message }) {
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
            {/* Backdrop with fade-in animation */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out"
                onClick={onClose}
            ></div>

            {/* Modal with slide-in animation */}
            <div className="relative bg-white rounded-xl p-6 max-w-2xl w-full mx-4 shadow-2xl transform transition-all duration-300 ease-in-out scale-100">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#A55B4B] focus:outline-none transition-colors duration-200"
                    aria-label="Close modal"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="mt-2">
                    {children ? (
                        <div className="space-y-4">{children}</div>
                    ) : (
                        <>
                            <h3 className="text-xl font-semibold text-[#210F37] mb-3">Error</h3>
                            <p className="text-gray-600">{message}</p>
                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-[#210F37] text-white rounded-lg hover:bg-[#4F1C51] focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 