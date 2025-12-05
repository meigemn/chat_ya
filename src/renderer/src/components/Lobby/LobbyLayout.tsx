// LobbyLayout.tsx (CORREGIDO)
import React, { ReactNode } from 'react';
import CreateRoomButton from './CreateRoomButton';
import LogoutButton from './LogoutButton';
import { ChatRoomDto } from '@renderer/types'; // Asegúrate de que esta ruta sea correcta

interface LobbyLayoutProps {
    chatList: ReactNode;
    chatArea: ReactNode;
    onRoomCreated: (newRoom: ChatRoomDto ) => void;
}

/**
 * Define el layout de dos columnas: lista de chats a la izquierda, área de chat a la derechça.

 */
export const LobbyLayout: React.FC<LobbyLayoutProps> = ({ chatList, chatArea, onRoomCreated }) => { 
    console.log('LobbyLayout renderizado'); //Para testeo
    return (
        <div className="flex h-screen bg-gray-50 p-4 border ">
            <LogoutButton/>
            {/* onRoomCreated ahora es accesible y se pasa al botón */}
            <CreateRoomButton onRoomCreated={onRoomCreated}/> 
            
            {/* Columna Izquierda: Lista de Chats - 25% de ancho (o ancho fijo) */}
            <div className="w-1/4 min-w-[300px] max-w-[400px] mr-4 h-full">
                {chatList}
            </div>

            {/* Columna Derecha: Área de Chat - Ocupa el espacio restante */}
            <div className="flex-1 h-full">
                {chatArea}
            </div>
        </div>
    );
};


export default LobbyLayout;