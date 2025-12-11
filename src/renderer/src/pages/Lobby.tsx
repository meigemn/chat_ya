// Frontend/pages/Lobby.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyLayout } from '../components/Lobby/LobbyLayout';
import ChatContent from '../components/Chat/ChatContent';
import ChatList from '../components/Lobby/ChatList';
import { Message } from '@renderer/types/chat';
import { ChatRoomDto, CreateRoomDto } from '@renderer/types';
import { useFetchUserRooms, useCreateRoom } from '../hooks/useRoomActions';

// El tipo que LobbyLayout espera (ChatRoomDto), aunque solo recibirá el nombre (string) del formulario.
type OnRoomCreatedHandler = (newRoom: ChatRoomDto) => void;

// Nombre de sala por defecto
const MOCK_CHAT_NAME = "Grupo de Desarrolladores";

const Lobby: React.FC = () => {
    const navigate = useNavigate();

    // --- LÓGICA DE SALAS Y API ---
    const { rooms, addRoom, isLoading, error, fetchRooms } = useFetchUserRooms();
    const { createRoom, isLoading: isCreating } = useCreateRoom();

    // --- LÓGICA DE CHAT Y ESTADO LOCAL ---
    const [messages, setMessages] = useState<Message[]>([]);
    const [nextId, setNextId] = useState(1);
    // Usamos number para ser consistentes con ChatRoomDto.id
    const [currentChatId, setCurrentChatId] = useState<number | null>(null);
    const [currentChatName, setCurrentChatName] = useState<string>(MOCK_CHAT_NAME);

    // Cargar las salas al montar el componente
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // --- MANEJADORES DE CHAT (LÓGICA INTERNA) ---

    const handleSendMessage = (text: string) => {
        if (!currentChatId || !text.trim()) return;

        const newMessage: Message = {
            id: nextId.toString(),
            text,
            sender: 'me',
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setNextId(prev => prev + 1);
        // (Aquí iría la llamada a la API de SignalR/WebSocket)
    };

    // Función que limpia estado y actualiza la sala actual (usada internamente)
    const handleSelectChat = useCallback((id: number) => {
        const selectedRoom = rooms.find(room => room.id === id);

        setMessages([]);
        setNextId(1);
        setCurrentChatId(id);
        setCurrentChatName(selectedRoom?.chatRoomName || `Sala #${id}`);

        // Navegar a la sala
        navigate(`/lobby/chat/${id}`);
    }, [rooms, navigate]);


    // --- MANEJADOR DE CREACIÓN DE SALA (CON ENGAÑO DE TIPOS) ---

    // Esta función recibe el objeto que el formulario *realmente* envía 
    // pero TypeScript piensa que recibe ChatRoomDto.
    // Usaremos 'as any' para tratar el objeto entrante como si contuviera el nombre.
    const handleRoomCreation: OnRoomCreatedHandler = (roomDataReceived) => {

        const createAndSync = async () => {
            try {
                // 1. Extraer el nombre del objeto recibido
                const chatRoomName: string = (roomDataReceived as any).chatRoomName;

                if (!chatRoomName) {
                    throw new Error("El nombre de la sala no se recibió correctamente.");
                }

                // 2. Crear el objeto DTO para la API
                const data: CreateRoomDto = { chatRoomName };

                // 3. Llamar a la API
                const newRoom = await createRoom(data);

                if (newRoom) {
                    // 4. Si tiene éxito, la añadimos al estado local y la seleccionamos
                    addRoom(newRoom);
                    console.log(`Sala ${newRoom.chatRoomName} creada en servidor y añadida localmente.`);

                    handleSelectChat(newRoom.id);
                }

            } catch (error) {
                console.error("Fallo durante el proceso de creación de la sala:", error);

            }
        };

        createAndSync();
    };

    return (
        <>
            <LobbyLayout
                // Solucion de tipado: Forzamos el tipo. 
                // La función recibe datos del formulario, pero TypeScript cree que recibe ChatRoomDto.
                onRoomCreated={handleRoomCreation as any}

                chatList={
                    <ChatList
                        rooms={rooms}
                        isLoading={isLoading || isCreating}
                        error={error}
                    />
                }

                chatArea={
                    <ChatContent
                        chatName={currentChatName}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        // 🔑 Valores de Mock para las nuevas props
                        loadMoreMessages={() => console.log('Mock Load More')}
                        hasMoreMessages={false} // No hay más mensajes en el mock
                        isLoadingMore={false}
                    />
                }
            />
        </>
    );
};

export default Lobby;