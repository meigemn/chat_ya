// src/components/Chat/ChatContent/MessageList.tsx
import React from 'react';
import { MessageItem } from './MessageItem';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp?: string;
}

interface MessageListProps {
    messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">
                    No hay mensajes. ¡Empieza una conversación!
                </p>
            ) : (
                messages.map((message) => (
                    <MessageItem
                        key={message.id}
                        text={message.text}
                        sender={message.sender}
                        timestamp={message.timestamp}
                    />
                ))
            )}
        </div>
    );
};
