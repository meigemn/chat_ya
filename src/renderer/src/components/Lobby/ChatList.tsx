// src/components/Lobby/ChatList.tsx
import React from 'react';
import ChatItem from './ChatItem';

interface Chat {
    id: string;
    name: string;
    lastMessage: string;
}

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (id: string) => void;
}

export default function ChatList({ chats, onSelectChat }: ChatListProps) {
    return (
        <div id='contedor-salas-lobby' className=''>
            {chats.map((chat) => (
                <ChatItem
                    key={chat.id}
                    name={chat.name}
                    lastMessage={chat.lastMessage}
                    onClick={() => onSelectChat(chat.id)}
                />
            ))}
        </div>
    );
}
