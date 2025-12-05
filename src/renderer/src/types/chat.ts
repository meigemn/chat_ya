//#region Imports
export interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp?: string;
}
//#endregion

//#region MessageListProps
export interface MessageListProps {
    messages: Message[];
    currentUserName: string;
}
//#endregion

//#region MessageInputProps
export interface MessageInputProps {
    onSend: (text: string) => void;
    isDisabled:boolean;
}
//#endregion

//#region ChatContentProps
export interface ChatContentProps {
    chatName?: string;
    messages?: Message[];
    onSendMessage?: (text: string) => void;
    // Opcional: Prop para deshabilitar el input (ej. si SignalR está desconectado)
    isSendingDisabled?: boolean; 
}
//#endregion