import React from 'react';
import { useParams } from 'react-router-dom';
import ChatContent from '@renderer/components/Chat/ChatContent';
// 🔑 IMPORTAR HOOKS CRUCIALES
import { useChatConnection } from '@renderer/hooks/useChatConnections'; // Para SignalR y mensajes
import { useFetchUserRooms } from '@renderer/hooks/useRoomActions'; // Para obtener el nombre de la sala

const ChatRoom: React.FC = () => {
    // 1. Obtener el ID de la sala de la URL
    const { id } = useParams<{ id: string }>();
    const roomId = id ? parseInt(id, 10) : 0;
    
    // 2. Obtener la lista de salas (para saber el nombre)
    const { rooms } = useFetchUserRooms(); 

    // 3. Conexión de SignalR (La fuente de verdad de los mensajes)
    const { 
        messages, 
        isConnected, 
        error, 
        sendMessage,
        // 🔑 AGREGAMOS LAS PROPIEDADES DE LAZY LOADING
        loadMoreMessages,
        hasMoreMessages,
        isLoadingMore,
    } = useChatConnection(roomId);
    
    // --- Lógica de la interfaz y estado ---
    
    const currentRoom = rooms.find(r => r.id === roomId);
    const chatName = currentRoom?.chatRoomName || `Sala ${roomId}`; 
    
    // Mostrar un estado de error o carga/conexión
    if (roomId === 0 || !currentRoom) {
        return (
            <div className="p-4 flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <p className="text-gray-500 text-lg">
                    Cargando información de la sala...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 flex items-center justify-center h-full bg-red-100 rounded-lg">
                <p className="text-red-700 text-lg">
                    Error de Conexión o Carga: {error}
                </p>
            </div>
        );
    }
    
    if (!isConnected) {
        return (
            <div className="p-4 flex items-center justify-center h-full bg-yellow-100 rounded-lg">
                <p className="text-yellow-700 text-lg">
                    Conectando a la sala de chat en tiempo real...
                </p>
            </div>
        );
    }

    // 4. Renderizar el área de chat con los datos en tiempo real
    return (
        <ChatContent
            chatName={chatName}
            messages={messages} // ⬅️ Lista de mensajes actualizada por SignalR
            onSendMessage={sendMessage} // ⬅️ Función de envío del hook de SignalR
            isSendingDisabled={!isConnected}
            
            // 🔑 PASANDO LAS PROPIEDADES DE LAZY LOADING
            loadMoreMessages={loadMoreMessages}
            hasMoreMessages={hasMoreMessages}
            isLoadingMore={isLoadingMore}
        />
    );
};

export default ChatRoom;