import React, { useState } from 'react';
// CAMBIA a importación nombrada
import { LobbyLayout } from '../components/Lobby/LobbyLayout';
import ChatContent, { Message } from '../components/Chat/ChatContent/Index';
import ChatList from '../components/Lobby/ChatList';
import HomeButton from '@renderer/components/Lobby/HomeButton';

// Mock data
const mockChats = [
    { id: '1', name: 'Grupo Desarrollo', lastMessage: 'Último mensaje' },
    { id: '2', name: 'Sala General', lastMessage: 'Hola a todos' }
];

const MOCK_CHAT_NAME = "Grupo de Desarrolladores";

const Lobby: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [nextId, setNextId] = useState(1);

    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: nextId.toString(),
            text,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, newMessage]);
        setNextId(prev => prev + 1);
    };

    const handleSelectChat = (id: string) => {
        console.log('Chat seleccionado:', id);
    };

    return (
        <LobbyLayout
        chatList={<ChatList chats={mockChats} onSelectChat={handleSelectChat} />}
        chatArea={
                
                <ChatContent
                chatName={MOCK_CHAT_NAME}
                messages={messages}
                onSendMessage={handleSendMessage}
                />
            }
            />
    );
};

export default Lobby;