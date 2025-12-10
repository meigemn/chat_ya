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

// Tipo para la función que el hook usará para recargar la lista
export type FetchRoomsFunction = () => Promise<void>;

// Tipo para el valor de retorno del hook useFetchUserRooms
export interface UseFetchUserRoomsResult {
    rooms: ChatRoomDto[];
    isLoading: boolean;
    error: string | null;
    fetchRooms: FetchRoomsFunction; 
    addRoom: (newRoom: ChatRoomDto) => void;
}