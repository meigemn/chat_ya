import { useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './useAuth';
import { Message } from '@renderer/types/chat';

const API_BASE_URL = 'https://localhost:7201';
const HUB_URL = `${API_BASE_URL}/chatHub`;
const PAGE_SIZE = 10; // Cantidad de mensajes a cargar por petición

// --- Función Auxiliar para la Carga Inicial (Solo llamada desde useEffect inicial) ---
// La separamos para que la lógica de carga inicial no dependa del estado de paginación del hook.
const fetchInitialMessages = async (
    roomId: number, 
    token: string, 
    setError: (msg: string | null) => void
): Promise<Message[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/messages/room/${roomId}?skip=0&take=${PAGE_SIZE}`, {
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

        return messageDtos.map((m: any): Message => ({
            id: m.id.toString(),
            text: m.content,
            sender: m.senderUserName,
            timestamp: m.sentDate,
        }));

    } catch (e: any) {
        console.error("Error al cargar mensajes históricos:", e);
        setError(`Error al cargar historial: ${e.message}`);
        return [];
    }
};
// --- FIN Función Auxiliar ---


export const useChatConnection = (roomId: number) => {
    const { user } = useAuth();

    // #region Estados Principales
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // #endregion

    // #region Estados de Paginación (Lazy Loading)
    const [messagesLoadedCount, setMessagesLoadedCount] = useState(0); // Este es el 'skip'
    const [hasMoreMessages, setHasMoreMessages] = useState(true); // Indica si hay más mensajes antiguos
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Bandera para evitar llamadas múltiples
    // #endregion

    // #region Función de Carga de Mensajes para Paginación (fetchMoreMessages)
    // CRÍTICO: Esta función SIEMPRE debe ser usada por loadMoreMessages y depende de los estados de paginación
    const fetchMoreMessages = useCallback(async (skip: number, take: number): Promise<Message[]> => {
        
        // No es necesario verificar hasMoreMessages ni isLoadingMore aquí,
        // ya que loadMoreMessages lo hace. Solo manejamos la lógica del fetch.
        setIsLoadingMore(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("No se encontró el token de autenticación para cargar historial.");
            setIsLoadingMore(false);
            return [];
        }

        try {
            // Usar skip y take en la URL
            const response = await fetch(`${API_BASE_URL}/api/messages/room/${roomId}?skip=${skip}&take=${take}`, {
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

            // Actualizar estado de paginación
            if (messageDtos.length < take) {
                setHasMoreMessages(false); // Ya no hay más que cargar
            }

            // Actualizar el contador total de mensajes cargados
            setMessagesLoadedCount(prev => prev + messageDtos.length);

            // Mapear y devolver
            return messageDtos.map((m: any): Message => ({
                id: m.id.toString(),
                text: m.content,
                sender: m.senderUserName,
                timestamp: m.sentDate,
            }));

        } catch (e: any) {
            console.error("Error al cargar más mensajes:", e);
            setError(`Error al cargar historial: ${e.message}`);
            return [];
        } finally {
            setIsLoadingMore(false);
        }
    }, [roomId]); // 🔑 CRÍTICO: SOLO depende de roomId. No de hasMoreMessages o isLoadingMore, para evitar bucles.
    // #endregion

    // #region Lógica de Carga de Más Mensajes (Lazy Loading Inverso)
    const loadMoreMessages = useCallback(async () => {
        if (!hasMoreMessages || isLoadingMore) {
            console.log("Lazy Loading: No hay más mensajes o ya está cargando.");
            return;
        }

        // messagesLoadedCount ya es el valor de 'skip' para la siguiente página
        const oldMessages = await fetchMoreMessages(messagesLoadedCount, PAGE_SIZE);

        if (oldMessages.length > 0) {
            // Insertar mensajes antiguos al inicio del array
            setMessages(prevMessages => [...oldMessages, ...prevMessages]);
        }
    }, [messagesLoadedCount, hasMoreMessages, isLoadingMore, fetchMoreMessages]);
    // #endregion


    // #region Conexión SignalR y Carga Inicial
    useEffect(() => {
        // Resetear estados al cambiar de sala
        setMessages([]);
        setMessagesLoadedCount(0);
        setHasMoreMessages(true);
        setError(null);

        if (roomId <= 0 || !user?.userName) {
            return;
        }

        const token = localStorage.getItem('authToken');
        if (!token) {
             setError("No se encontró el token de autenticación.");
             return;
        }

        // 1. Crear conexión
        const accessTokenFactory = (): string | undefined => token || undefined;

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: accessTokenFactory
            } as signalR.IHttpConnectionOptions)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
        let cleanupExecuted = false;


        // 2. Configurar el Listener para mensajes en tiempo real
        newConnection.on('ReceiveMessage', (messageId: string, user: string, text: string) => {
            const now = new Date().toISOString();
            const newMessage: Message = {
                id: messageId,
                text: text,
                sender: user,
                timestamp: now,
            };

            setMessages(prevMessages => [...prevMessages, newMessage]);
        });

        newConnection.onclose((error) => {
            if (error) {
                setError("Conexión perdida. Intentando reconectar...");
            }
            setIsConnected(false);
        });


        // 3. Iniciar la conexión y cargar el historial inicial
        const startConnectionAndLoadChat = async () => {
            try {
                // 3a. Conectar SignalR
                await newConnection.start();
                setIsConnected(true);

                // 3b. Cargar Historial Inicial (Usando la función auxiliar no memoizada/self-contained)
                const initialMessages = await fetchInitialMessages(roomId, token, setError);
                setMessages(initialMessages);
                
                // 3c. Actualizar el estado de conteo de mensajes después de la carga inicial
                setMessagesLoadedCount(initialMessages.length);
                if (initialMessages.length < PAGE_SIZE) {
                    setHasMoreMessages(false);
                }

                // 3d. Unirse a la sala
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
            newConnection.off('ReceiveMessage');

            if (newConnection) {
                newConnection.stop().catch(e => console.error("Error al detener la conexión:", e));
            }
        };
    // 🔑 CRÍTICO: Ya no se incluye fetchMessages. Solo dependemos de roomId y user.
    }, [roomId, user?.userName]); 
    // #endregion


    // #region Función de Enviar Mensajes
    const sendMessage = useCallback((text: string) => {
        if (connection && isConnected && text.trim()) {
            connection.invoke('SendMessage', roomId.toString(), text)
                .catch(err => {
                    console.error('Error al enviar mensaje:', err);
                    setError("Fallo al enviar el mensaje al servidor.");
                });
        }
    }, [connection, isConnected, roomId]);
    // #endregion


    // #region Return del Hook
    return {
        messages,
        isConnected,
        error,
        sendMessage,
        loadMoreMessages,
        hasMoreMessages,
        isLoadingMore,
    };
    // #endregion
};