// Frontend/pages/ChatRoom.tsx 
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useChatConnection } from '@renderer/hooks/useChatConnections';
// Asegúrate de que esta ruta sea correcta para tu componente de UI de chat
import ChatDisplay from '../components/Chat/ChatContent/Index'; 

const ChatRoom: React.FC = () => {
    // 1. Obtener el ID de la URL
    const { id } = useParams<{ id: string }>(); 
    const roomId = id ? Number(id) : 0;
    
    // Validar ID
    if (roomId === 0 || isNaN(roomId)) {
        return <div className="p-4 text-red-500">Error: ID de sala no válido.</div>;
    }
    
    // 2. Usar el hook de conexión SignalR
    const { messages, isConnected, error, sendMessage } = useChatConnection(roomId); 

    // 3. Adaptar la estructura de mensajes (Memorizado para eficiencia)
    const adaptedMessages = useMemo(() => messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.user, // Nombre del usuario del broadcast de SignalR
        timestamp: msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    })), [messages]);
    
    // 4. Adaptar la función de envío
    const handleSendMessage = (text: string) => {
        if (isConnected) {
            sendMessage(text);
        } else {
            console.error("No conectado para enviar el mensaje.");
        }
    };

    const chatName = `Sala #${roomId} (${isConnected ? 'Conectado' : 'Desconectado'})`;

    // 5. Renderizar el componente de UI
    return (
        <div className="h-full bg-white rounded-lg shadow-lg flex flex-col">
            {error && (
                <div className="p-2 text-sm text-red-700 bg-red-100 border-b border-red-300">
                    🔴 Error de Conexión: {error}
                </div>
            )}
            <ChatDisplay
                chatName={chatName}
                messages={adaptedMessages}
                onSendMessage={handleSendMessage}
                isSendingDisabled={!isConnected} // Deshabilitar el input si no hay conexión
            />
        </div>
    );
};

export default ChatRoom;