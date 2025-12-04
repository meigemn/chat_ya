import React, { useState } from 'react';
// Asegúrate de que esta importación sea correcta (por ejemplo, '@/hooks/useRoomActions')
import { useCreateRoom } from '../../hooks/UseRoomActions'; 

const CreateRoomButton: React.FC = () => {
    const [roomName, setRoomName] = useState('');
    
    // Usamos el hook y obtenemos el ID de la sala creada (successId)
    const { createRoom, successId, isLoading, error } = useCreateRoom();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const trimmedName = roomName.trim();
        if (!trimmedName) {
            alert('El nombre de la sala no puede estar vacío.');
            return;
        }
        
        // Llamada al hook con el payload CreateRoomDto
        const newRoomId = await createRoom({ chatRoomName: trimmedName });
        
        if (newRoomId) {
            // El hook devuelve el ID si fue exitoso
            alert(`Sala creada con éxito. ID: ${newRoomId}`);
            setRoomName(''); 
        }
        // Si hay error, el hook ya lo maneja y se mostrará abajo.
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Crear Nueva Sala de Chat</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Escribe el nombre de la sala..."
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    disabled={isLoading}
                />
                
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
            
            {/* Mensajes de feedback */}
            {successId && (
                <p className="mt-4 text-sm font-medium text-green-600">
                    ¡Sala con ID #{successId} creada!
                </p>
            )}
            {error && (
                <p className="mt-4 text-sm font-medium text-red-600">
                    Error al crear la sala: {error}
                </p>
            )}
        </div>
    );
};

export default CreateRoomButton;