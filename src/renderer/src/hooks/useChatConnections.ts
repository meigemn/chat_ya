// Frontend/hooks/useChatConnections.ts (FINAL Y FUNCIONAL)

import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './useAuth'; 

// Importamos el tipo Message desde el archivo central
import { Message } from '@renderer/types/chat'; 

const API_BASE_URL = 'https://localhost:7201'; 
const HUB_URL = `${API_BASE_URL}/chatHub`;

// --- Función Auxiliar para Cargar el Historial ---
// Ya no necesitamos el nombre de usuario aquí, solo el token y el room id.
const fetchRoomMessages = async (roomId: number, token: string, setError: (msg: string | null) => void): Promise<Message[]> => {
    try {
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
                // 🔑 SOLUCIÓN: Usamos el nombre de usuario real (senderUserName) para que MessageList compare.
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

    // 1. Conexión y Carga de Historial 
    useEffect(() => {
        setMessages([]); 
        setError(null); 

        if (roomId <= 0 || !user?.userName) { 
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("No se encontró el token de autenticación.");
            return;
        }

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        
        let cleanupExecuted = false;

        const startConnectionAndLoadChat = async () => {
            try {
                await newConnection.start();
                setIsConnected(true);

                // 2. Cargar mensajes históricos del REST API
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

        return () => {
            cleanupExecuted = true;
            if (newConnection) {
                newConnection.stop().catch(e => console.error("Error al detener la conexión:", e));
            }
        };
    }, [roomId, user?.userName]);


    // 5. Configurar la recepción de mensajes 
    useEffect(() => {
        if (!connection) return; 
        
        connection.off('ReceiveMessage');

        connection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {

            const now = new Date().toISOString(); 

            // Creamos el mensaje usando el tipo Message importado
            const newMessage: Message = {
                id: messageId,
                text: text,
                // 🔑 SOLUCIÓN: Usamos el nombre de usuario real del remitente
                sender: user, 
                timestamp: now, 
            };
            
            // 🔑 CÓDIGO CLAVE PARA EL TIEMPO REAL: setMessages debe funcionar
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        connection.onclose((error) => {
            if (error) {
                setError("Conexión perdida. Intentando reconectar...");
            }
            setIsConnected(false);
        });

        return () => {
            connection.off('ReceiveMessage');
        };
    }, [connection]);


    // 6. Función para enviar mensajes
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