import React, { ReactNode } from 'react';
import HomeButton from './HomeButton';
import CreateRoomButton from './CreateRoomButton';


interface LobbyLayoutProps {
    chatList: ReactNode;
    chatArea: ReactNode;
}

/**
 * Define el layout de dos columnas: lista de chats a la izquierda, área de chat a la derecha.
 * Se asume que usa el 100% de la altura y un ancho máximo en el centro de la pantalla.
 */
export const LobbyLayout: React.FC<LobbyLayoutProps> = ({ chatList, chatArea }) => {
    console.log('LobbyLayout renderizado'); //Para testeo
    return (
        <div className="flex h-screen w-full bg-gray-50 p-4">
            <HomeButton/>
            <CreateRoomButton/>
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
