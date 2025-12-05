// auth.ts

/**
 * 1. Petición de Login (Payload enviado al backend)
 * ------------------------------------------------
 * Corresponde a 'LoginRequestDtos' en tu API de C#.
 */
export interface ILoginRequest {
    email: string;
    password: string;
}

//#region Dto de usuario (UserDto)
export interface IUserDto {
    id: string;
    userName: string;
}
//#endregion

//#region respuesta del login (LoginResponseDto)
export interface ILoginResponse {
    token: string;       // Token (JWT)
    user: IUserDto;
    expiration: string;  //expiración del token
}
//#endregion
//#region Error Generico
export interface IGenericError {
    message: string; 
    code: string;    
}
//#endregion

//#region interfaz User
export interface User {
    id: string;
    email: string;
    userName: string;
}
//#endregion

//#region AuthState y AuthContextType

export interface AuthState {
    token: string | null;
    user: User | null; 
}

export interface AuthContextType extends AuthState {
    login: (authData: { token: string; user: User }) => void; 
    logout: () => void;
    isAuthenticated: boolean;
}
//#endregion
