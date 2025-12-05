// Frontend/hooks/useChatConnection.ts
import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

// Define la estructura de mensajes que el hook devolverá
interface ChatMessage {
    id: string; // ID del mensaje
    user: string; // Nombre del usuario que lo envió
    text: string; // Contenido del mensaje
    timestamp: Date; // Timestamp de la recepción
}

// URL del hub de SignalR (AJUSTA ESTA URL)
const HUB_URL = 'http://localhost:7201/chatHub';

export const useChatConnection = (roomId: number) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Inicializar y conectar al Hub
    useEffect(() => {
        if (roomId <= 0) return;

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("No se encontró el token de autenticación.");
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                // Pasar el token para la autenticación en el Hub
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        // 2. Iniciar la conexión
        newConnection.start()
            .then(() => {
                console.log(`Conectado al Hub. Intentando unirse a Sala ${roomId}...`);
                setIsConnected(true);

                // 3. Unirse a la sala después de la conexión exitosa
                // La función 'JoinRoom' debe existir en tu ChatHub de C#
                return newConnection.invoke('JoinRoom', roomId.toString());
            })
            .catch(e => {
                console.error("Error al iniciar la conexión SignalR o unirse a la sala:", e);
                setError("No se pudo conectar al servidor de chat o unirse a la sala.");
                setIsConnected(false);
            });

        // 4. Limpiar al desmontar
        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [roomId]);


    // 5. Configurar la recepción de mensajes
    useEffect(() => {
        if (!connection) return;

        // Método que el Hub de C# debe llamar ('ReceiveMessage')
        connection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {
            console.log(`Mensaje recibido: ${user}: ${text}`);

            const newMessage: ChatMessage = {
                id: messageId, // El ID generado por el backend
                user: user,
                text: text,
                timestamp: new Date(),
            };
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        // Opcional: Manejar errores de conexión en tiempo real
        connection.onclose((error) => {
            if (error) {
                console.error("Conexión cerrada con error:", error);
                setError("Conexión perdida. Intentando reconectar...");
            }
            setIsConnected(false);
        });

        // Limpieza de listener
        return () => {
            connection.off('ReceiveMessage');
        };
    }, [connection]);


    // 6. Función para enviar mensajes
    const sendMessage = useCallback((text: string) => {
        if (connection && isConnected && text.trim()) {
            // La función 'SendMessage' debe existir en tu ChatHub de C#
            // El backend debe manejar la lógica de Broadcast a la sala.
            connection.invoke('SendMessage', roomId.toString(), text)
                .catch(err => {
                    console.error('Error al enviar mensaje:', err);
                    setError("Fallo al enviar el mensaje al servidor.");
                });
        }
    }, [connection, isConnected, roomId]);


    return { messages, isConnected, error, sendMessage };
};