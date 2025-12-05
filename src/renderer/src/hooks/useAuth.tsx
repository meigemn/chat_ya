import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthContextType, AuthState, User } from '@renderer/types/auth'; 

// 2. CONTEXTO Y PROVIDER

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        token: null,
        user: null,
    });

    // Carga el estado inicial de localStorage
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userJson = localStorage.getItem('currentUser');
        
        if (token && userJson) {
            try {
                // Casting a la interfaz importada
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

export default AuthProvider;