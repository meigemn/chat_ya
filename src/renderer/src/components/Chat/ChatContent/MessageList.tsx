// src/components/Chat/ChatContent/MessageList.tsx
import React from 'react';
import { MessageItem } from './MessageItem';
import { MessageListProps } from '@renderer/types/chat';


export const MessageList: React.FC<MessageListProps> = ({ messages,currentUserName }) => {
    return (
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">
                    No hay mensajes. ¡Empieza una conversación!
                </p>
            ) : (
                messages.map((message) => {
                    // Calcula si el mensaje es del usuario actual.
                    const isCurrentUser = message.sender === currentUserName;

                    // El componente MessageItem necesita la lógica 'me' | 'other'
                    const displaySender = isCurrentUser ? 'me' : 'other';

                    return (
                        <MessageItem
                            key={message.id}
                            text={message.text}
                            sender={displaySender as 'me' | 'other'} // Casteamos para MessageItem
                            timestamp={message.timestamp}
                        />
                    );
                })
            )}
        </div>
    );
};
