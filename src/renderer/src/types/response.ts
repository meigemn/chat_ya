//#region  CreateEditRemoveResponseDto
export interface CreateEditRemoveDto {
    id: number;
    success: boolean;
    errors: string [];

}
//#endregion

//#region GenericErrorDto
export interface GenericErrorDto {
    location: string;
    description: string;

}
//#endregion