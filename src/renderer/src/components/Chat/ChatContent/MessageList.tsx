import React, { useRef, useEffect, useCallback, useLayoutEffect } from 'react';
import { MessageItem } from './MessageItem';
import { MessageListProps } from '@renderer/types/chat'; // Asegúrate de que MessageListProps incluya las nuevas props

// Definición extendida de las propiedades que MessageList necesita ahora
interface ExtendedMessageListProps extends MessageListProps {
    // Propiedades necesarias para el Lazy Loading
    loadMoreMessages: () => void;
    isLoadingMore: boolean;
    hasMoreMessages: boolean;
}


export const MessageList: React.FC<ExtendedMessageListProps> = ({
    messages,
    currentUserName,
    loadMoreMessages,
    isLoadingMore,
    hasMoreMessages,
}) => {

    // Referencia al contenedor que tiene el scroll
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Referencias para el mantenimiento de la posición del scroll (CRUCIAL)
    const prevScrollHeightRef = useRef(0);
    const initialLoadRef = useRef(true);

    // #region 1. Lógica de Detección de Scroll (Llama al hook)
    const handleScroll = useCallback(() => {
        const container = chatContainerRef.current;

        // Si no hay contenedor, o ya está cargando, o no hay más mensajes, salimos.
        if (!container || isLoadingMore || !hasMoreMessages) {
            return;
        }

        // Detectar si el usuario está cerca de la parte superior (e.g., a menos de 10 píxeles)
        if (container.scrollTop <= 10) {
            console.log("Lazy Load: Tope detectado. Cargando más...");
            loadMoreMessages(); // Llama a la función del hook
        }
    }, [isLoadingMore, hasMoreMessages, loadMoreMessages]);


    // Conectar el detector de scroll al contenedor
    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        // Limpieza: Remover el evento al desmontar o reejecutar
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [handleScroll]);

    // #endregion


    // #region 2. Lógica de Mantenimiento de Posición (Se dispara al renderizar nuevos mensajes)
    useLayoutEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const currentScrollHeight = container.scrollHeight;

        // 1. Carga Inicial: Mover el scroll al fondo
        if (initialLoadRef.current) {
            if (currentScrollHeight > 0 && messages.length > 0) {
                container.scrollTop = currentScrollHeight;
                initialLoadRef.current = false;
            }
        }
        // 2. Carga de Lazy Load (Inverso): Mantener la posición relativa
        else if (currentScrollHeight > prevScrollHeightRef.current) {
            const heightDifference = currentScrollHeight - prevScrollHeightRef.current;
            container.scrollTop += heightDifference;
            console.log(`Scroll ajustado: ${heightDifference}px`);
        }

        // 3. Actualizar la altura para la próxima comparación
        prevScrollHeightRef.current = currentScrollHeight;

    }, [messages]);
    // #endregion


    return (
        // Aplicamos la referencia (ref) al div que maneja el scroll
        <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto space-y-2 flex flex-col" // Añadido 'flex flex-col' para que los hijos funcionen bien
        >

            {isLoadingMore && (
                <div className="flex justify-center items-center py-4">
                    <div
                        className="w-6 h-6 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"
                        role="status"
                    >
                        {/* El div se encarga de la animación y la forma del spinner */}
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            )}
            {/* Indicador de Fin de Historial */}
            {!hasMoreMessages && !isLoadingMore && messages.length > 0 && (
                <div className="text-center p-2 text-gray-400 text-sm">
                    --- Fin del Historial ---
                </div>
            )}

            {messages.length === 0 ? (
                <p className="text-gray-500 text-center mt-20">
                    {/* Mensaje por defecto cuando no hay mensajes */}
                    {!isLoadingMore ? 'No hay mensajes. ¡Empieza una conversación!' : ''}
                </p>
            ) : (
                messages.map((message) => {
                    const isCurrentUser = message.sender === currentUserName;
                    const displaySender = isCurrentUser ? 'me' : 'other';

                    return (
                        <MessageItem
                            key={message.id}
                            text={message.text}
                            sender={displaySender as 'me' | 'other'}
                            timestamp={message.timestamp}
                        />
                    );
                })
            )}
        </div>
    );
};