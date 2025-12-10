// App.tsx (CÓDIGO MODIFICADO PARA NO REDIRIGIR AUTOMÁTICAMENTE)

import { Routes, Route, Navigate, } from 'react-router-dom';
import React from 'react';
import LobbyPage from './pages/LobbyPage'; 
import Login from './components/Login/Login' 
import ChatRoom from '@renderer/pages/ChatRoom';
import { useAuth } from './hooks/useAuth'; 
import Lobby from './pages/Lobby';

// --- COMPONENTE DE PROTECCIÓN DE RUTA ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth(); 
    
    if (!isAuthenticated) {
        // Sigue redirigiendo al Login si intentan acceder al lobby sin token
        return <Navigate to="/" replace />; 
    }
    return <>{children}</>;
};

// --- COMPONENTE HOME (Ahora es la página de bienvenida/login) ---
function Home() {
    const { isAuthenticated } = useAuth(); // Revisa el estado de autenticación
    
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
                            {/**Si esta autenticado, se dirige al lobby, sino de vuelta al login */}
                            {isAuthenticated ? (<Lobby/>) : (<Login /> )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PLACEHOLDER PARA LA RUTA RAÍZ DEL LOBBY ---
const DefaultChatArea: React.FC = () => (
    <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
        <p className="text-gray-500 text-lg">
            App.tsx
        </p>
    </div>
);


// --- APP PRINCIPAL CON LAS RUTAS ---
function App(): React.JSX.Element {
    // const { isAuthenticated } = useAuth(); // Ya no necesitamos el estado aquí

    return (
        <Routes>
            {/* 1. Ruta de Login/Bienvenida (/) */}
            {/* 🚨 CAMBIO CLAVE: Siempre renderiza <Home /> */}
            <Route path="/" element={<Home />} />
            
            {/* 2. Ruta Protegida del Lobby (/lobby) */}
            <Route 
                path="/lobby" 
                element={
                    <ProtectedRoute>
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