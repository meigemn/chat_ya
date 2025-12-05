import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatContentProps } from '@renderer/types/chat';
import { Message } from '@renderer/types/chat';
import { useAuth } from '@renderer/hooks/useAuth';

/**
 * Componente principal que ensambla la cabecera, la lista de mensajes y la entrada.
 */
export const ChatContent: React.FC<ChatContentProps> = ({
    chatName = 'Chat seleccionado',
    messages = [],
    onSendMessage = (text) => console.log('Mensaje enviado:', text),
    isSendingDisabled = false,
}) => {
    const { user } = useAuth(); 
    const currentUserName = user?.userName || 'UsuarioDesconocido';
    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-grey-800 ">
            <ChatHeader chatName={chatName} />
            
            {/* Pasar la propiedad requerida */}
            <MessageList 
                messages={messages} 
                currentUserName={currentUserName} 
            /> 
            
            {/* Pasar propiedad de deshabilidtación */}
            <MessageInput 
                onSend={onSendMessage} 
                isDisabled={isSendingDisabled}
            />
        </div>
    );
};

export default ChatContent;