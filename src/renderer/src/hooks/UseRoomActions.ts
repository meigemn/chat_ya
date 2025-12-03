import { useState } from 'react';
import { CreateRoomDto, CreateEditRemoveDto } from '../types'; 


// --- PLACHOLDER: Función de fetch autenticado (DEBES IMPLEMENTARLA) ---
async function authenticatedFetch(url: string, options: RequestInit): Promise<any> {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Usuario no autenticado.');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    
    // Si la respuesta es 200/201, intenta devolver el JSON.
    if (response.ok) {
        // Asumiendo que la respuesta es CreateEditRemoveDto
        return response.json(); 
    }
    
    // Si la respuesta no es 2xx, lee el cuerpo del error
    const errorBody = await response.json();
    
    // Si la API devuelve un array de errores (como en CreateEditRemoveDto si success=false)
    if (errorBody.errors && Array.isArray(errorBody.errors)) {
        throw new Error(errorBody.errors.join(', '));
    }
    
    // Si la API devuelve un error genérico (GenericErrorDto)
    if (errorBody.description) {
        throw new Error(errorBody.description);
    }

    throw new Error('Error desconocido al comunicarse con la API.');
}
// --- FIN DEL PLACHOLDER ---


export const useCreateRoom = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successId, setSuccessId] = useState<number | null>(null);

    const createRoom = async (roomData: CreateRoomDto): Promise<number | null> => {
        setIsLoading(true);
        setError(null);
        setSuccessId(null);
        
        try {
            // El endpoint es POST /api/rooms
            // Tipamos la respuesta como tu DTO de éxito/error
            const result: CreateEditRemoveDto = await authenticatedFetch('/api/rooms', {
                method: 'POST',
                body: JSON.stringify(roomData),
            });
            
            if (result.success) {
                setSuccessId(result.id);
                setIsLoading(false);
                return result.id;
            } else {
                // Si la API devuelve success: false con errores
                setError(result.errors.join(', ') || 'Error al crear la sala.');
                setIsLoading(false);
                return null;
            }

        } catch (err: any) {
            setError(err.message || 'Fallo en la conexión o en la API.');
            setIsLoading(false);
            return null;
        }
    };

    return { createRoom, successId, isLoading, error };
};