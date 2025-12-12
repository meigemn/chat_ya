import React from 'react';

interface ChatHeaderProps {
    chatName: string;
    status?: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    chatName,
    status = 'En línea',
}) => {
    return (
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold truncate">{chatName}</h2>
            <p className="text-xs text-blue-200 truncate">{status}</p>
        </div>
    );
};
