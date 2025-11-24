import React from 'react';

interface MessageItemProps {
    text: string;
    sender: 'me' | 'other';
    timestamp?: string;
}

export const MessageItem: React.FC<MessageItemProps> = ({ text, sender, timestamp }) => {
    return (
        <div className={`flex mb-2 ${sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-xs px-4 py-2 rounded-lg ${sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
            >
                <p>{text}</p>
                {timestamp && (
                    <p className={`text-xs mt-1 ${sender === 'me' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {timestamp}
                    </p>
                )}
            </div>
        </div>
    );
};
