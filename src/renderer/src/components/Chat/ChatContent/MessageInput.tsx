// src/components/Chat/ChatContent/MessageInput.tsx
import React, { useState } from 'react';
import { MessageInputProps } from '@renderer/types/chat';
export const MessageInput: React.FC<MessageInputProps> = ({ onSend,isDisabled }) => {
    const [newMessage, setNewMessage] = useState('');

    const handleSend = () => {
        // No enviar si está deshabilitado
        if (isDisabled || newMessage.trim() === '') return; 
        onSend(newMessage);
        setNewMessage('');
    };

    return (
        <div className="p-4 bg-white border-t border-gray-300">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};
