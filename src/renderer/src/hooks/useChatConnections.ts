import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './useAuth';
import { Message } from '@renderer/types/chat';

const API_BASE_URL = 'https://localhost:7201';
const HUB_URL = `${API_BASE_URL}/chatHub`;

// --- Función Auxiliar para Cargar el Historial ---
const fetchRoomMessages = async (roomId: number, token: string, setError: (msg: string | null) => void): Promise<Message[]> => {
    try {
        if (!token) {
            throw new Error("Token de autenticación es nulo al llamar al historial.");
        }

        const response = await fetch(`${API_BASE_URL}/api/messages/room/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${errorData?.Error || "Fallo al obtener mensajes del historial."}`);
        }

        const messageDtos = await response.json();

        return messageDtos.map((m: any): Message => {
            return {
                id: m.id.toString(),
                text: m.content,
                sender: m.senderUserName,
                timestamp: m.sentDate,
            };
        });

    } catch (e: any) {
        console.error("Error al cargar mensajes históricos:", e);
        setError(`Error al cargar historial: ${e.message}`);
        return [];
    }
};
// --- FIN Función Auxiliar ---


export const useChatConnection = (roomId: number) => {
    const { user } = useAuth();

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Conexión, Carga de Historial y Configuración de Listener (Todo en un solo useEffect estable)
    useEffect(() => {
        setMessages([]);
        setError(null);

        if (roomId <= 0 || !user?.userName) {
            return;
        }

        // 1. Crear conexión
        const accessTokenFactory = (): string | undefined => {
            const currentToken = localStorage.getItem('authToken');
            return currentToken || undefined;
        };

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: accessTokenFactory
            } as signalR.IHttpConnectionOptions)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        let cleanupExecuted = false;


        // 2. Configurar el Listener antes de iniciar la conexión 
        newConnection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {

            const now = new Date().toISOString();
            const newMessage: Message = {
                id: messageId,
                text: text,
                sender: user,
                timestamp: now,
            };

            // Actualizador del estado.
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });
        
        newConnection.onclose((error) => {
            if (error) {
                setError("Conexión perdida. Intentando reconectar...");
            }
            setIsConnected(false);
        });


        // 3. Iniciar la conexión y cargar el historial
        const startConnectionAndLoadChat = async () => {
            const token = localStorage.getItem('authToken');

            if (!token) {
                setError("No se encontró el token de autenticación para cargar historial.");
                return;
            }

            try {
                await newConnection.start();
                setIsConnected(true);

                const historicalMessages = await fetchRoomMessages(roomId, token, setError);
                setMessages(historicalMessages);

                await newConnection.invoke('JoinRoom', roomId.toString());

            } catch (e: any) {
                if (!cleanupExecuted) {
                    setError(`Fallo al iniciar el chat: ${e.message || "Error desconocido."}`);
                    setIsConnected(false);
                }
            }
        };

        startConnectionAndLoadChat();

        // 4. Cleanup (Detener conexión y eliminar listener)
        return () => {
            cleanupExecuted = true;
            
            // Importante: eliminar el listener antes de detener la conexión
            newConnection.off('ReceiveMessage'); 
            
            if (newConnection) {
                newConnection.stop().catch(e => console.error("Error al detener la conexión:", e));
            }
        };
    }, [roomId, user?.userName]);


    // 2. Función para enviar mensajes (sin cambios)
    const sendMessage = useCallback((text: string) => {
        if (connection && isConnected && text.trim()) {
            connection.invoke('SendMessage', roomId.toString(), text)
                .catch(err => {
                    console.error('Error al enviar mensaje:', err);
                    setError("Fallo al enviar el mensaje al servidor.");
                });
        }
    }, [connection, isConnected, roomId]);


    return { messages, isConnected, error, sendMessage };
};