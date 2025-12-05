// Frontend/components/CreateRoomButton.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateRoom } from '../../hooks/useRoomActions'; 
import { ChatRoomDto } from '@renderer/types';

// Definir la prop que el componente padre usará para actualizar la lista
interface CreateRoomButtonProps {
    onRoomCreated: (room: ChatRoomDto) => void;
}

const CreateRoomButton: React.FC<CreateRoomButtonProps> = ({ onRoomCreated }) => {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate(); // Hook de navegación
    
    // El hook ahora devuelve el objeto ChatRoomDto o null
    const { createRoom, isLoading, error } = useCreateRoom(); 

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedName = roomName.trim();
        if (!trimmedName) {
            alert('El nombre de la sala no puede estar vacío.');
            return;
        }
        
        // Llamamos a createRoom, que devuelve ChatRoomDto | null
        const newRoom = await createRoom({ chatRoomName: trimmedName });
        
        if (newRoom) {
            alert(`Sala creada con éxito. ID: ${newRoom.id}`);
            setRoomName(''); 
            
            // 1. Notificar al padre para que actualice la lista visible
            onRoomCreated(newRoom); 
            
            // 2. Navegar inmediatamente a la sala creada
            navigate(`/chat/${newRoom.id}`); 
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Sala de Chat</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input de sala (Mantenido) */}
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Escribe el nombre de la sala..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    disabled={isLoading}
                />
                
                {/* Botón de envío (Mantenido) */}
                <button
                    type="submit"
                    className={`w-full py-2.5 px-4 rounded-lg shadow-md text-sm font-semibold text-white transition duration-150
                        ${isLoading 
                            ? 'bg-indigo-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700'
                        } 
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creando Sala...' : 'Crear Sala'}
                </button>
            </form>
            
            {/* Mensaje de error (Mantenido) */}
            {error && (
                <p className="mt-4 text-sm font-medium text-red-600">
                    Error al crear la sala: {error}
                </p>
            )}
        </div>
    );
};

export default CreateRoomButton;