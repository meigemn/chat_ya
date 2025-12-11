import React from 'react';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatContentProps } from '@renderer/types/chat';
import { useAuth } from '@renderer/hooks/useAuth';

// Extendemos ChatContentProps para incluir las props de Lazy Loading
interface ExtendedChatContentProps extends ChatContentProps {
    // Nuevas propiedades necesarias
    loadMoreMessages: () => void;
    isLoadingMore: boolean;
    hasMoreMessages: boolean;
}

/**
 * Componente principal que ensambla la cabecera, la lista de mensajes y la entrada.
 */
export const ChatContent: React.FC<ExtendedChatContentProps> = ({ // Usamos el nuevo tipo
    chatName = 'Chat seleccionado',
    messages = [],
    onSendMessage = (text) => console.log('Mensaje enviado:', text),
    isSendingDisabled = false,
    
    // 🔑 Desestructurar las nuevas props
    loadMoreMessages,
    isLoadingMore,
    hasMoreMessages,
}) => {
    const { user } = useAuth(); 
    const currentUserName = user?.userName || 'UsuarioDesconocido';
    
    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-grey-800 ">
            <ChatHeader chatName={chatName} />
            
            {/* Pasar la propiedad requerida y las nuevas props */}
            <MessageList 
                messages={messages} 
                currentUserName={currentUserName} 
                
                // 🔑 Pasando las props a MessageList
                loadMoreMessages={loadMoreMessages} 
                isLoadingMore={isLoadingMore}
                hasMoreMessages={hasMoreMessages}
            /> 
            
            {/* Pasar propiedad de deshabilitación */}
            <MessageInput 
                onSend={onSendMessage} 
                isDisabled={isSendingDisabled}
            />
        </div>
    );
};

export default ChatContent;