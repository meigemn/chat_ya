//#region ChangePasswordDto
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
//#endregion

//#region GenericFilterRequestDto
export interface GenericFilterRequestDto {
    value: string | null;
    propertyName: string | null;
    searchString: string | null;
}
//#endregion

//#region LoginRequestDto 
export interface LoginRequestDto {
    email: string | null;
    password: string | null;
    twoFactorCode: string | null;
    twoFactorRecoveryCode: string | null;
}
//#endregion