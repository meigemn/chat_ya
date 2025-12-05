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

/**
 * 2. DTO de Usuario (Información básica del usuario)
 * ------------------------------------------------
 * Corresponde a 'UserDto' en tu API de C#.
 */
export interface IUserDto {
    id: string;
    userName: string;
}

/**
 * 3. Respuesta de Login (Respuesta exitosa del backend)
 * -----------------------------------------------------
 * Corresponde a 'LoginResponseDto' en tu API de C#.
 */
export interface ILoginResponse {
    token: string;       // El JSON Web Token (JWT)
    user: IUserDto;
    expiration: string;  // Fecha y hora de expiración del token (ISO 8601 string)
}

/**
 * 4. DTO de Error Genérico
 * ------------------------
 * Corresponde a 'GenericErrorDto' en tu API de C# para respuestas 400/401.
 */
export interface IGenericError {
    message: string; // Mensaje de error (e.g., "Credenciales inválidas.")
    code: string;    // Código interno (e.g., "Auth.Login")
}

export interface AuthState {
    token: string | null;
    user: Object | null;
}

export interface AuthContextType extends AuthState {
    login: (authData: { token: string; user: Object }) => void;
    logout: () => void;
    isAuthenticated: boolean;
}
