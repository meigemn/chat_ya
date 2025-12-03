//#region CreateMessageDto
export interface CreateMessageDto {
    content: string;
    roomId: number
}
//#endregion 

//#region MessageDto
export interface MessageDto {
    id: number;
    content: string;
    sentDate: string;
    senderId: number;
    senderUserName: string;
    roomId: number;
}
//#endregion

//#region UpdateMessageDto
export interface UpdateMessageDto {
    newContent: string;
}
//#endregion