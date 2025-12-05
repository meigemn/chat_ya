import { useState, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { ChatRoomDto, UseFetchUserRoomsResult } from '../types/rooms';
import { AxiosError } from 'axios';
import { CreateRoomDto } from '@renderer/types';

// 1. Hook para Listar y Gestionar Salas 
export const useFetchUserRooms = (): UseFetchUserRoomsResult => {
    const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener las salas del usuario (GET /api/rooms)
    const fetchRooms = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.get<ChatRoomDto[]>('/rooms');
            setRooms(response.data);
        } catch (err) {
            const axiosError = err as AxiosError<{ error?: string }>;
            console.error("Error al cargar salas:", axiosError);

            // Intenta obtener el mensaje de error del cuerpo de la respuesta del servidor (si existe),
            // si no, usa el mensaje de error de Axios, o uno genérico.
            const errorMessage = axiosError.response?.data?.error
                || axiosError.message
                || "Error desconocido al cargar las salas.";

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Función para añadir una sala localmente después de la creación
    const addRoom = useCallback((newRoom: ChatRoomDto) => {
        setRooms(prevRooms => [...prevRooms, newRoom]);
    }, []);

    // El hook devuelve explícitamente todos los miembros del tipo UseFetchUserRoomsResult
    return { rooms, isLoading, error, fetchRooms, addRoom };
};


// HOOK 2: Para crear una nueva sala (Usado en CreateRoomButton)

export const useCreateRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createRoom = useCallback(async (roomData: CreateRoomDto): Promise<ChatRoomDto | null> => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama a POST /api/rooms
            const response = await apiClient.post<ChatRoomDto>('/rooms', roomData);

            return response.data; // Devuelve el DTO de la nueva sala
        } catch (err) {
            const axiosError = err as AxiosError<{ error?: string }>;
            console.error("Error al crear sala:", axiosError);

            const errorMessage = axiosError.response?.data?.error
                || axiosError.message
                || "Error desconocido al crear sala.";

            setError(errorMessage);
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { createRoom, isLoading, error };
};