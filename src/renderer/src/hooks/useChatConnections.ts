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
// NOTA: Asegúrate de que esta URL sea la correcta para tu backend
const API_BASE_URL = 'https://192.168.125.226:7201'; 
const HUB_URL = `${API_BASE_URL}/chatHub`;

// --- Función Auxiliar para Cargar el Historial ---
const fetchRoomMessages = async (roomId: number, token: string, setError: (msg: string | null) => void): Promise<ChatMessage[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/messages/room/${roomId}`, { 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            // Manejar errores de respuesta HTTP
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData?.Error || "Fallo al obtener mensajes del historial."}`);
        }

        const messageDtos = await response.json();
        
        // Mapear los DTOs del backend (MessageDto) al formato ChatMessage del frontend
        return messageDtos.map((m: any) => ({
            id: m.id.toString(),
            user: m.senderUserName,
            text: m.content,
            timestamp: new Date(m.sentDate),
        })) as ChatMessage[];

    } catch (e: any) {
        console.error("Error al cargar mensajes históricos:", e);
        setError(`Error al cargar historial: ${e.message}`);
        return []; // Devuelve un array vacío en caso de fallo
    }
};
// --- FIN Función Auxiliar ---


export const useChatConnection = (roomId: number) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Inicializar, conectar al Hub y cargar historial (dependiente de roomId)
    useEffect(() => {
        // Limpiar el estado de mensajes inmediatamente al cambiar de sala
        setMessages([]); 
        setError(null); // Limpiar errores anteriores

        if (roomId <= 0) {
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("No se encontró el token de autenticación.");
            return;
        }

        // Crear la nueva conexión
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        
        let cleanupExecuted = false;

        // Función para iniciar la conexión y cargar el chat
        const startConnectionAndLoadChat = async () => {
            try {
                await newConnection.start();
                console.log(`Conectado al Hub. Intentando unirse a Sala ${roomId}...`);
                setIsConnected(true);

                // 2. Cargar mensajes históricos del REST API
                const historicalMessages = await fetchRoomMessages(roomId, token, setError);
                setMessages(historicalMessages);

                // 3. Unirse a la sala de SignalR para recibir nuevos mensajes
                await newConnection.invoke('JoinRoom', roomId.toString());
                console.log(`Unido a la sala ${roomId} en SignalR.`);

            } catch (e: any) {
                if (!cleanupExecuted) {
                    console.error("Error en la conexión o carga de chat:", e);
                    setError(`Fallo al iniciar el chat: ${e.message || "Error desconocido."}`);
                    setIsConnected(false);
                }
            }
        };

        startConnectionAndLoadChat();


        // 4. Limpiar al desmontar o al cambiar de dependencia (roomId)
        return () => {
            cleanupExecuted = true;
            if (newConnection) {
                // Se detiene la conexión anterior
                newConnection.stop()
                    .then(() => console.log(`Desconectado de SignalR al cambiar de sala ${roomId}`))
                    .catch(e => console.error("Error al detener la conexión:", e));
            }
        };
    }, [roomId]);


    // 5. Configurar la recepción de mensajes (solo necesita re-ejecutarse si 'connection' cambia)
    useEffect(() => {
        if (!connection) return;

        // Quitar cualquier listener anterior antes de agregar uno nuevo (es una buena práctica)
        connection.off('ReceiveMessage');

        // Método que el Hub de C# debe llamar ('ReceiveMessage')
        connection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {
            console.log(`Mensaje recibido: ${user}: ${text}`);

            const newMessage: ChatMessage = {
                id: messageId, // El ID generado por el backend
                user: user,
                text: text,
                timestamp: new Date(),
            };
            // 🔑 ¡Añadir el nuevo mensaje al final de la lista!
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
            // El backend debe manejar la lógica de Broadcast a la sala específica (roomId).
            connection.invoke('SendMessage', roomId.toString(), text)
                .catch(err => {
                    console.error('Error al enviar mensaje:', err);
                    setError("Fallo al enviar el mensaje al servidor.");
                });
        }
    }, [connection, isConnected, roomId]);


    return { messages, isConnected, error, sendMessage };
};