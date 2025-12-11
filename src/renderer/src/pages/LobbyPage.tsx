// Frontend/pages/LobbyPage.tsx (CORREGIDO)

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { LobbyLayout } from '@renderer/components/Lobby/LobbyLayout';
import ChatList from '@renderer/components/Lobby/ChatList';
import { useFetchUserRooms } from '@renderer/hooks/useRoomActions';
import ChatContent from '@renderer/components/Chat/ChatContent';
import { useChatConnection } from '@renderer/hooks/useChatConnections'; // 🔑 Importar el hook de SignalR

const DefaultChatArea: React.FC = () => (
    <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
        <p className="text-xl text-gray-600">Selecciona una sala para empezar a chatear.</p>
    </div>
);

const LobbyPage: React.FC = () => {
    // --- Lógica de la Lista de Salas ---
    const { rooms, isLoading: isRoomsLoading, error: roomsError, addRoom, fetchRooms } = useFetchUserRooms();

    // Cargar salas al montar el componente
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    
    // --- Lógica de la Sala Activa y SignalR ---
    
    const { id } = useParams<{ id: string }>();
    const activeRoomId = id ? parseInt(id, 10) : 0;
    
    // 🔑 CONEXIÓN SIGNALR: Usar el hook de SignalR para la sala activa
    const { 
        messages, 
        isConnected, 
        error: chatError, // ⬅️ Usamos chatError
        sendMessage 
    } = useChatConnection(activeRoomId);

    // Buscar el nombre de la sala actual para la cabecera
    const currentRoom = rooms.find(r => r.id === activeRoomId);
    const chatName = currentRoom?.chatRoomName || `Sala #${activeRoomId}`;

    // 1. Definir el contenido de la columna izquierda (chatList)
    const chatListContent = (
        <div className="flex-1 min-h-0"> 
            <ChatList 
                rooms={rooms} 
                isLoading={isRoomsLoading} 
                error={roomsError} 
            />
        </div>
    );

    // 2. Definir el contenido del Área de Chat (derecha)
    
    let chatAreaContent: React.ReactNode;
    
    if (activeRoomId && currentRoom) {
        
        // 🔑 NUEVA LÓGICA: Mostrar el error de conexión del chat si existe
        if (chatError) {
             chatAreaContent = (
                <div className="p-8 text-center bg-red-100 h-full flex items-center justify-center rounded-lg">
                    <p className="text-xl text-red-700 font-semibold">
                        Error en la conexión al Chat:
                        <br/>
                        <span className="font-normal text-lg">{chatError}</span>
                    </p>
                </div>
            );
        } else if (!isConnected) {
            // Mostrar estado de conectando
             chatAreaContent = (
                <div className="p-8 text-center bg-yellow-100 h-full flex items-center justify-center rounded-lg">
                    <p className="text-xl text-yellow-700 font-semibold">
                        Conectando a la sala de chat...
                    </p>
                </div>
            );
        }
        else {
             // Si hay un ID, la sala existe y estamos conectados, mostramos el chat.
             chatAreaContent = (
                <ChatContent
                    chatName={chatName}
                    messages={messages} 
                    onSendMessage={sendMessage} 
                    isSendingDisabled={!isConnected}
                />
            );
        }
        
    } else if (activeRoomId && !currentRoom) {
         // Si hay ID pero la sala no está en la lista (error de sala no encontrada/no autorizado)
        chatAreaContent = (
            <div className="p-4 text-center text-red-500">Sala no encontrada o no estás autorizado.</div>
        );
    } else {
        // Si no hay ID en la URL (estamos en /lobby)
        chatAreaContent = <DefaultChatArea />;
    }

    return (
        <LobbyLayout 
            chatList={chatListContent} 
            chatArea={chatAreaContent} 
            onRoomCreated={addRoom} 
        />
    );
};

export default LobbyPage;