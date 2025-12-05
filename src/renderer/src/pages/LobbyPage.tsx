// Frontend/pages/LobbyPage.tsx
import React from 'react';
import { LobbyLayout } from '@renderer/components/Lobby/LobbyLayout';
import CreateRoomButton from '@renderer/components/Lobby/CreateRoomButton';  
import ChatList from '@renderer/components/Lobby/ChatList';
import LogoutButton from '@renderer/components/Lobby/LogoutButton';
import { useFetchUserRooms } from '@renderer/hooks/useFetchUserRoom';
import { ChatRoomDto } from '@renderer/types';

const LobbyPage: React.FC = () => {
    // 1. Obtener el estado y la función para añadir salas del hook
    const { rooms, isLoading, error, addRoom } = useFetchUserRooms(); 

    // 2. Definir el contenido de la columna izquierda (chatList)
    const chatListContent = (
        <>
            {/* Sección de Botones (Logout y Creación) */}
            <div className="p-4 bg-white shadow-lg rounded-lg mb-4 space-y-4">
                <LogoutButton />
                {/* 🔑 Conexión Clave: Pasamos la función 'addRoom' al botón de creación */}
                <CreateRoomButton onRoomCreated={addRoom} />
            </div>
            
            {/* Lista de Salas */}
            <div className="flex-1 min-h-0">
                <ChatList 
                    rooms={rooms} 
                    isLoading={isLoading} 
                    error={error} 
                />
            </div>
        </>
    );

    // 3. Definir el área de chat por defecto
    const defaultChatArea = (
        <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
            <p className="text-gray-500 text-lg">
                👋 Selecciona una sala de chat de la izquierda o crea una nueva.
            </p>
        </div>
    );

    return (
        <LobbyLayout
            chatList={chatListContent}
            chatArea={defaultChatArea}
        />
    );
};

export default LobbyPage;