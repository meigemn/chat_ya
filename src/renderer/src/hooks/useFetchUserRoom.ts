import { useState, useEffect } from 'react';
import { ChatRoomDto } from '@renderer/types'; // Asumimos que la ruta es correcta
import { authenticatedFetch } from './UseRoomActions'; // Importar la función de fetch autenticado

export const useFetchUserRooms = () => {
    const [rooms, setRooms] = useState<ChatRoomDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para obtener la lista inicial de salas
    const fetchRooms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama al endpoint GET /api/rooms
            const roomsList: ChatRoomDto[] = await authenticatedFetch<ChatRoomDto[]>('/api/rooms', {
                method: 'GET',
            });
            setRooms(roomsList.reverse()); // Invertir para que la última creada esté arriba
        } catch (err: any) {
            setError(err.message || 'Fallo al cargar la lista de salas.');
            console.error("Error fetching rooms:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    // Ejecutar al montar el componente
    useEffect(() => {
        fetchRooms();
    }, []);

    // Función para añadir una sala creada al estado local sin recargar todo
    const addRoom = (newRoom: ChatRoomDto) => {
        // Añadir la nueva sala al inicio de la lista
        setRooms(prevRooms => [newRoom, ...prevRooms]); 
    };

    // Función para recargar la lista si es necesario
    const refetch = () => {
        fetchRooms();
    }

    return { rooms, isLoading, error, addRoom, refetch };
};