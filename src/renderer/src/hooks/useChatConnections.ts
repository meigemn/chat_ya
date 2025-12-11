// Frontend/hooks/useChatConnections.ts (CORREGIDO Y RESTAURANDO FUNCIONALIDAD)

import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './useAuth'; 

// 🔑 Importamos el tipo Message desde el archivo central
import { Message } from '@renderer/types/chat'; 

// NOTA: Asegúrate de que esta URL sea la correcta para tu backend
const API_BASE_URL = 'https://localhost:7201'; 
const HUB_URL = `${API_BASE_URL}/chatHub`;

// --- Función Auxiliar para Cargar el Historial ---
const fetchRoomMessages = async (roomId: number, token: string, currentUserName: string, setError: (msg: string | null) => void): Promise<Message[]> => {
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
            const isMe = m.senderUserName === currentUserName;
            
            return {
                id: m.id.toString(),
                text: m.content,
                // 🔑 CORRECCIÓN DE ESTILO: Asignamos 'me' o 'other' para facilitar el estilo UI
                sender: isMe ? 'me' : 'other', 
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
    const currentUserName = user?.userName; 
    
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]); 
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Conexión y Carga de Historial (Depende de roomId y currentUserName)
    useEffect(() => {
        setMessages([]); 
        setError(null); 

        if (roomId <= 0 || !currentUserName) { 
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
                console.log(`Conectado al Hub. Intentando unirse a Sala ${roomId}...`);
                setIsConnected(true);

                const historicalMessages = await fetchRoomMessages(roomId, token, currentUserName, setError);
                setMessages(historicalMessages);

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

        return () => {
            cleanupExecuted = true;
            if (newConnection) {
                newConnection.stop()
                    .then(() => console.log(`Desconectado de SignalR al cambiar de sala ${roomId}`))
                    .catch(e => console.error("Error al detener la conexión:", e));
            }
        };
    }, [roomId, currentUserName]); 


    // 5. Configurar la recepción de mensajes (Depende de connection y currentUserName)
    useEffect(() => {
        if (!connection || !currentUserName) return; 
        
        connection.off('ReceiveMessage');

        connection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {
            console.log(`Mensaje recibido: ${user}: ${text}`);

            const isMe = user === currentUserName;
            const now = new Date().toISOString(); 

            // Creamos el mensaje usando el tipo Message importado
            const newMessage: Message = {
                id: messageId,
                text: text,
                // 🔑 CORRECCIÓN DE ESTILO: Asignamos 'me' o 'other'
                sender: isMe ? 'me' : 'other', 
                timestamp: now, 
            };
            
            // 🔑 ¡ESTE ES EL CÓDIGO CLAVE PARA EL TIEMPO REAL! 
            // Esto asegura que el mensaje se añada a la lista
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        connection.onclose((error) => {
            if (error) {
                console.error("Conexión cerrada con error:", error);
                setError("Conexión perdida. Intentando reconectar...");
            }
            setIsConnected(false);
        });

        return () => {
            connection.off('ReceiveMessage');
        };
    }, [connection, currentUserName]); // 🔑 DEPENDENCIAS CORRECTAS: Aseguran que el listener se reestablece al reconectar o cambiar de usuario


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