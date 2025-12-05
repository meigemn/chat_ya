// App.tsx (CÓDIGO CORREGIDO Y COMPLETO)

import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import LobbyPage from './pages/LobbyPage'; 
import Login from './components/Login/Login' 
import ChatRoom from '@renderer/pages/ChatRoom';
// Importamos useAuth para usar el estado de autenticación global
import { useAuth } from './hooks/useAuth'; 

// --- COMPONENTE DE PROTECCIÓN DE RUTA ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 🔑 USAMOS EL ESTADO GLOBAL DE AUTENTICACIÓN
    const { isAuthenticated } = useAuth(); 
    
    if (!isAuthenticated) {
        // Redirigir al Login si no está autenticado
        // 🚨 Importante: Redirigimos a la raíz, que es donde se renderiza el Login
        return <Navigate to="/" replace />; 
    }
    return <>{children}</>;
};

// --- COMPONENTE HOME (Ahora es la página de bienvenida/login) ---
function Home() {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div id='envoltorio-icono-texto-boton' className='border '>
                <div id='envoltorio-icono-texto' className='border flex flex-col items-center w-60'>
                    <div id='icono-chat-ya' className='bg-blue-400 rounded-full w-20 h-20 flex items-center justify-center text-white'>
                        icono
                    </div>
                    <div id='titulo-y-descripción' className='flex flex-col items-center justify-center'>
                        <div id='titulo-chat-ya' className='mt-6'>
                            Chat ya
                        </div>
                        <div id='descripcion-chat-ya'>
                            Chat en tiempo real
                        </div>
                        <div>
                            {/* Tu componente de login real */}
                            <Login /> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PLACEHOLDER PARA LA RUTA RAÍZ DEL LOBBY ---
// Se muestra cuando estamos en /lobby sin un chat seleccionado
const DefaultChatArea: React.FC = () => (
    <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
        <p className="text-gray-500 text-lg">
            👋 Selecciona una sala de chat de la izquierda o crea una nueva.
        </p>
    </div>
);


// --- APP PRINCIPAL CON LAS RUTAS ---
function App(): React.JSX.Element {
    // 🔑 Leemos el estado de autenticación global
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* 1. Ruta de Login/Bienvenida (/) */}
            {/* 🔑 USAMOS EL ESTADO DEL CONTEXTO: Si está autenticado, redirige. Si no, muestra Login. */}
            <Route 
                path="/" 
                element={
                    isAuthenticated 
                        ? <Navigate to="/lobby" replace /> 
                        : <Home />
                } 
            />
            
            {/* 2. Ruta Protegida del Lobby (/lobby) */}
            <Route 
                path="/lobby" 
                element={
                    <ProtectedRoute>
                        {/* LobbyPage actúa como el Layout base, y usa <Outlet> para renderizar sus hijos */}
                        <LobbyPage /> 
                    </ProtectedRoute>
                } 
            >
                {/* 2a. Sub-ruta: /lobby (Muestra el mensaje por defecto) */}
                <Route index element={<DefaultChatArea />} /> 
                
                {/* 2b. Sub-ruta: /lobby/chat/:id (Muestra el chat real) */}
                <Route path="chat/:id" element={<ChatRoom />} /> 
                
            </Route>
            
            {/* 3. Captura cualquier otra ruta y redirige a la raíz */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;