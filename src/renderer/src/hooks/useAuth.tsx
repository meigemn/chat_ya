import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType } from '@renderer/types/auth';
import { AuthState } from '@renderer/types/auth';
// -----------------------------------------------------
// 1. DEFINICIÓN DE TIPOS (Ajusta ILoginResponse según tu necesidad)
// -----------------------------------------------------

// Asegúrate de que ILoginResponse y User coincidan con los tipos de tu login.tsx
interface User {
    id: string;
    email: string;
    userName: string; 
}


// -----------------------------------------------------
// 2. CONTEXTO Y PROVIDER
// -----------------------------------------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// 🔑 CAMBIO CLAVE 1: Eliminamos 'export const' aquí
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        token: null,
        user: null,
    });

    // 🔑 useEffect para cargar el estado inicial de localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('currentUser');
        
        if (token && userJson) {
            try {
                const user = JSON.parse(userJson) as User;
                setState({ token, user });
            } catch (e) {
                console.error("Error al parsear el usuario de localStorage:", e);
                // Si falla, limpiar datos corruptos
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
        }
    }, []);
    
    // Función de Login: Guarda el estado en memoria y en localStorage
    const login = useCallback(({ token, user }: { token: string; user: User }) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        setState({ token, user });
    }, []);

    // Función de Logout: Limpia el estado y localStorage
    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        setState({ token: null, user: null });
    }, []);
    
    const isAuthenticated = !!state.token;

    const contextValue = {
        ...state,
        login,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// -----------------------------------------------------
// 3. HOOK DE CONSUMO PERSONALIZADO
// -----------------------------------------------------

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// 🔑 CAMBIO CLAVE 2: Exportamos AuthProvider por defecto
export default AuthProvider;