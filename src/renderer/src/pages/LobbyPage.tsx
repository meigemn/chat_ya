// Frontend/pages/LobbyPage.tsx (CÓDIGO FINAL CORREGIDO)
import React, { useEffect } from 'react';
// 🔑 Ya no necesitamos useLocation porque la lógica de fallback está en App.tsx
import { Outlet } from 'react-router-dom'; 
import { LobbyLayout } from '@renderer/components/Lobby/LobbyLayout';
import ChatList from '@renderer/components/Lobby/ChatList';
import { useFetchUserRooms } from '@renderer/hooks/useRoomActions';
import { ChatRoomDto } from '@renderer/types/rooms'; 


const LobbyPage: React.FC = () => {
    // 1. Obtener el estado y la función para añadir salas del hook
    const { rooms, isLoading, error, addRoom, fetchRooms } = useFetchUserRooms();

    // 🔑 Cargar salas al montar el componente
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // 2. Definir el contenido de la columna izquierda (chatList)
    const chatListContent = (
        <>
            {/* Lista de Salas */}
            {/* NOTA: Si quisieras que ChatList siempre ocupe el espacio sin scroll, deberías ajustar el layout aquí */}
            <div className="flex-1 min-h-0"> 
                <ChatList 
                    rooms={rooms} 
                    isLoading={isLoading} 
                    error={error} 
                />
            </div>
        </>
    );

    // 3. 🔑 SOLUCIÓN: El área de chat es simplemente el Outlet.
    // El router (App.tsx) se encarga de decidir si Outlet renderiza ChatRoom o DefaultChatArea.
    const chatAreaContent = (
        <Outlet /> 
    );

    return (
        <LobbyLayout 
            chatList={chatListContent} 
            chatArea={chatAreaContent} 
            // Pasamos la función requerida al LobbyLayout para que este la pase al CreateRoomButton
            onRoomCreated={addRoom} 
        />
    );
};

export default LobbyPage;