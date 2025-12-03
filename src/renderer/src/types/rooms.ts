//#region CreateRoomDto
export interface CreateRoomDto {
    chatRoomName: string;
}
//#endregion 

//#region ChatRoomDto
export interface ChatRoomDto {
    id: number;
    chatRoomName: string | null;
}
//#endregion

//#region UpdateChatRoomDto
export interface UpdateChatRoomDto {
    chatRoomName: string | null;
}
//#endregion