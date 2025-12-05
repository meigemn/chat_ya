import { useState } from 'react';
// Asegúrate de que las rutas de importación de tus DTOs sean correctas (ej. '../types/room')
import { CreateRoomDto, ChatRoomDto } from '../types'; 

// URL base de tu API de .NET (AJUSTA ESTA URL si tu backend no corre en 5000 o si la url es diferente)
const API_BASE_URL = 'http://localhost:5000'; 

// --- Función de fetch autenticado ---
export async function authenticatedFetch<T>(endpoint: string, options: RequestInit): Promise<T> {
    const token = localStorage.getItem('authToken');
    if (!token) {
        throw new Error('Usuario no autenticado. Inicia sesión para continuar.');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const url = `${API_BASE_URL}${endpoint}`;
    
    // Ejecutar la petición
    const response = await fetch(url, { ...options, headers });
    
    // Manejo de respuesta: Intentar leer el cuerpo si no es 204 No Content
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const responseBody = isJson && response.status !== 204 ? await response.json() : null;

    if (response.ok) {
        // Respuesta exitosa (200, 201, 202, etc.)
        return responseBody as T; 
    }
    
    // Si la respuesta no es 2xx, lanza un error basado en el cuerpo del error
    
    if (response.status === 401 || response.status === 403) {
        // Error de autenticación o autorización
        throw new Error('No tienes permiso para realizar esta acción. Token inválido o expirado.');
    }

    // Manejo de errores de la API (ej. 400 Bad Request)
    if (responseBody) {
        // 1. Si la API devuelve un array de errores (ej. { errors: [...] })
        if (responseBody.errors && Array.isArray(responseBody.errors)) {
            throw new Error(responseBody.errors.join('; '));
        }
        
        // 2. Si la API devuelve un error genérico con una descripción (GenericErrorDto)
        if (responseBody.description) {
            throw new Error(responseBody.description);
        }

        // 3. Si la API devuelve un error simple (ej. el que pusiste en el C#: { Error = "..." })
        if (responseBody.error) {
            throw new Error(responseBody.error);
        }
    }

    // Error HTTP desconocido
    throw new Error(`Error desconocido: ${response.status} ${response.statusText}`);
}
// --- FIN DE LA FUNCIÓN DE FETCH ---


export const useCreateRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createRoom = async (roomData: CreateRoomDto): Promise<ChatRoomDto | null> => {
        setIsLoading(true);
        setError(null);
        
        try {
            // El endpoint es POST /api/rooms
            // El backend devuelve ChatRoomDto (Status 201 Created)
            const newRoom: ChatRoomDto = await authenticatedFetch<ChatRoomDto>('/api/rooms', {
                method: 'POST',
                body: JSON.stringify(roomData),
            });
            
            // Si llegamos aquí, el fetch fue exitoso (código 201)
            //newRoom tiene de valor el cuerpo JSON que la API devuelve
            /*
                *newRoom: verifica que la respuesta Json no sea null o undefined
                *newRoom.is: Verifica que el objeto newRoom tenga la propiedad id
            */
            if (newRoom && newRoom.id) {
                setIsLoading(false);
                // Devolvemos el ID para que el componente CreateRoomButton pueda navegar
                return newRoom; 
            } else {
                setError('Respuesta exitosa, pero el ID de la sala no se encontró. Revise el DTO de respuesta.');
                setIsLoading(false);
                return null;
            }

        } catch (err: any) {
            // El error es la excepción lanzada por authenticatedFetch
            setError(err.message || 'Fallo en la conexión o en la API.');
            setIsLoading(false);
            return null;
        }
    };

    return { createRoom,isLoading, error };
};