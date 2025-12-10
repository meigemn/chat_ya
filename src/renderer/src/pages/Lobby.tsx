import React, { useState } from 'react';
import { LobbyLayout } from '../components/Lobby/LobbyLayout';
import ChatContent from '../components/Chat/ChatContent/Index';
import ChatList from '../components/Lobby/ChatList';
import { Message } from '@renderer/types/chat';
// Asegúrate de que esta línea importa correctamente ChatRoomDto
import { ChatRoomDto } from '@renderer/types'; 
import { useFetchUserRooms } from '../hooks/useRoomActions';

const MOCK_CHAT_NAME = "Grupo de Desarrolladores";

const Lobby: React.FC = () => {
    // 🚨 1. LLAMADA AL HOOK DENTRO DEL COMPONENTE
    const { rooms, addRoom, isLoading, error } = useFetchUserRooms(); 
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [nextId, setNextId] = useState(1);
    
    // 🚨 2. CORRECCIÓN: Usar 'chatRoomName' en lugar de 'name'
    const handleRoomCreation = (newRoom: ChatRoomDto) => {
        // Llama a la función del hook para actualizar el estado local de salas
        addRoom(newRoom); 
        console.log(`Nueva sala ${newRoom.chatRoomName} añadida localmente.`);
    };
    
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

    

    return (
        <>
            <LobbyLayout
                onRoomCreated={handleRoomCreation} 
                chatList={
                    <ChatList 
                        rooms={rooms} 
                        isLoading={isLoading} 
                        error={error} 
                    />
                }
                
                chatArea={
                    <ChatContent
                        chatName={MOCK_CHAT_NAME}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                    />
                }
            />
        </>
    );
};

export default Lobby;