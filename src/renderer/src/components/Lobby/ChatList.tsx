import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatRoomDto } from '@renderer/types';

interface ChatListProps {
    rooms: ChatRoomDto[];
    isLoading: boolean;
    error: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ rooms, isLoading, error }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Cargando salas...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
            <h2 className="text-xl font-bold p-4 bg-gray-100 border-b">Salas Disponibles ({rooms.length})</h2>
            <div className="flex-1 overflow-y-auto">
                {rooms.length === 0 ? (
                    <p className="p-4 text-gray-500">No tienes salas aún. ¡Crea una!</p>
                ) : (
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            className="p-3 border-b hover:bg-indigo-50 cursor-pointer transition duration-150"
                            onClick={() => navigate(`/lobby/chat/${room.id}`)}
                        >
                            <span className="font-semibold text-gray-800">{room.chatRoomName}</span>
                            <span className="text-sm text-gray-500 ml-2">#{room.id}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;