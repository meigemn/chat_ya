// Frontend/pages/LobbyPage.tsx (ORDENADO POR REGIONES)

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Importaciones de Componentes y Hooks
import { LobbyLayout } from '@renderer/components/Lobby/LobbyLayout';
import ChatList from '@renderer/components/Lobby/ChatList';
import ChatContent from '@renderer/components/Chat/ChatContent';
import { useFetchUserRooms } from '@renderer/hooks/useRoomActions'; // Asegúrate que la ruta es correcta
import { useChatConnection } from '@renderer/hooks/useChatConnections';
// #region Componente por Defecto (Área de Chat vacía)
const DefaultChatArea: React.FC = () => (
    <div className="flex items-center justify-center h-full bg-gray-200 rounded-lg">
        <p className="text-xl text-gray-600">Selecciona una sala para empezar a chatear.</p>
    </div>
);
// #endregion

const LobbyPage: React.FC = () => {
    
    // #region Lógica de Salas y Hooks
    const { rooms, isLoading: isRoomsLoading, error: roomsError, addRoom, fetchRooms } = useFetchUserRooms();

    // Obtener el ID de la sala activa de la URL
    const { id } = useParams<{ id: string }>();
    const activeRoomId = id ? parseInt(id, 10) : 0;
    
    // Conexión SignalR y estado del Chat
    const {
        messages,
        isConnected,
        error: chatError,
        sendMessage,
        // 🔑 AGREGAMOS LAS PROPIEDADES DE LAZY LOADING
        loadMoreMessages,
        hasMoreMessages,
        isLoadingMore,
    } = useChatConnection(activeRoomId);

    // Buscar el nombre de la sala actual para la cabecera
    const currentRoom = rooms.find(r => r.id === activeRoomId);
    const chatName = currentRoom?.chatRoomName || `Sala #${activeRoomId}`;
    // #endregion

    // #region Inicialización
    // Cargar salas al montar el componente (sólo se ejecuta una vez)
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);
    // #endregion

    // #region Contenido de la columna ChatList (Izquierda)
    const chatListContent = (
        <div className="flex-1 min-h-0">
            <ChatList
                rooms={rooms}
                isLoading={isRoomsLoading}
                error={roomsError}
            />
        </div>
    );
    // #endregion 

    // #region Contenido del Área de Chat (Derecha)
    let chatAreaContent: React.ReactNode;

    if (activeRoomId && currentRoom) {
        // Sala seleccionada y encontrada en la lista

        if (chatError) {
            // Error de conexión SignalR
            chatAreaContent = (
                <div className="p-8 text-center bg-red-100 h-full flex items-center justify-center rounded-lg">
                    <p className="text-xl text-red-700 font-semibold">
                        Error en la conexión al Chat:
                        <br />
                        <span className="font-normal text-lg">{chatError}</span>
                    </p>
                </div>
            );
        } else if (!isConnected && messages.length === 0) {
            // Estado de conectando (antes de unirse)
            chatAreaContent = (
                <div className="p-8 text-center bg-yellow-100 h-full flex items-center justify-center rounded-lg">
                    <p className="text-xl text-yellow-700 font-semibold">
                        Conectando a la sala de chat...
                    </p>
                </div>
            );
        }
        else {
            // Conectado y listo para chatear
            chatAreaContent = (
                // 🔑 AHORA PASAMOS TODAS LAS PROPIEDADES REQUERIDAS POR CHATCONTENT
                <ChatContent
                    chatName={chatName}
                    messages={messages}
                    onSendMessage={sendMessage}
                    isSendingDisabled={!isConnected}
                    
                    // 🔑 Propiedades de Lazy Loading
                    loadMoreMessages={loadMoreMessages}
                    hasMoreMessages={hasMoreMessages}
                    isLoadingMore={isLoadingMore}
                />
            );
        }

    } else if (activeRoomId && !currentRoom) {
        // ID en URL, pero sala no cargada/no encontrada
        chatAreaContent = (
            <div className="p-4 text-center text-red-500">Sala no encontrada o no estás autorizado.</div>
        );
    } else {
        // No hay ID en la URL (Área por defecto)
        chatAreaContent = <DefaultChatArea />;
    }
    // #endregion

    // #region Renderizado Principal
    return (
        <LobbyLayout
            chatList={chatListContent}
            chatArea={chatAreaContent}
            onRoomCreated={addRoom} // Asumiendo que esta es una función para actualizar la lista de salas después de la creación
        />
    );
    // #endregion
};

export default LobbyPage;