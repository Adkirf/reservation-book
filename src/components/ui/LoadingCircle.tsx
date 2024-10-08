import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const LoadingCircle: React.FC = () => {
    const [showReload, setShowReload] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowReload(true);
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleReload = () => {
        window.location.reload();
    };

    if (showReload) {
        return (
            <div className="flex items-center flex-col justify-center h-full w-full">
                <button
                    onClick={handleReload}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                    aria-label="Reload page"
                >
                    <RefreshCw size={32} className="text-gray-900" />
                </button>
                <p>{"Try to open and close the app."}</p>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
    );
};

export default LoadingCircle;