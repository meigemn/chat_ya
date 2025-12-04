import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

// Mover esta interfaz a un archivo de tipos común (como types.d.ts) es una buena práctica.
export interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    timestamp?: string;
}

interface ChatContentProps {
    chatName?: string;
    messages?: Message[];
    onSendMessage?: (text: string) => void;
}

/**
 * Componente principal que ensambla la cabecera, la lista de mensajes y la entrada.
 * Ocupa todo el espacio vertical disponible (h-full).
 */
export const ChatContent: React.FC<ChatContentProps> = ({
    chatName = 'Chat seleccionado',
    messages = [],
    onSendMessage = (text) => console.log('Mensaje enviado:', text),
}) => {
    // Si la lista está vacía, se usa 'flex-1' para que la lista de mensajes ocupe
    // el espacio y centre el mensaje de "No hay mensajes".
    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-grey-800 ">
            <ChatHeader chatName={chatName} />
            {/* flex-1 asegura que la lista de mensajes use todo el espacio restante */}
            <MessageList messages={messages} />
            <MessageInput onSend={onSendMessage} />
        </div>
    );
};

export default ChatContent;