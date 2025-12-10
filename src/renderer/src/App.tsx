import { Routes, Route, Navigate, } from 'react-router-dom';
import React from 'react';
import LobbyPage from './pages/LobbyPage'; 
import Login from './components/Login/Login' 
import ChatRoom from '@renderer/pages/ChatRoom';
import { useAuth } from './hooks/useAuth';
// --- COMPONENTE DE PROTECCIÓN DE RUTA ---
// Asegura que,el usuario no está autenticado,
// sea enviado a la raíz (/), que a su vez muestra el Login.
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth(); 
    
    if (!isAuthenticated) {
        // Redirige a la raíz (donde se renderiza el Login)
        return <Navigate to="/" replace />; 
    }
    return <>{children}</>;
};

// --- COMPONENTE HOME (MODIFICADO) ---
// Actúa como el Guardián de Ruta para el Login.
function Home() {
    const { isAuthenticated } = useAuth();
    
    // **NUEVO CÓDIGO CLAVE:** Si el usuario YA está autenticado, lo forzamos al lobby.
    if (isAuthenticated) {
        return <Navigate to="/lobby" replace />;
    }
    
    // Si NO está autenticado, mostramos la interfaz con el componente Login.
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
                            {/* **Aquí solo se renderiza el Login si NO está autenticado** */}
                            <Login /> 
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
            App.tsx - Área de Chat por Defecto
        </p>
    </div>
);


// --- APP PRINCIPAL CON LAS RUTAS ---
function App(): React.JSX.Element {
    return (
        <Routes>
            {/* 1. Ruta de Login/Bienvenida (/) */}
            {/* Si está logueado, Home lo redirige a /lobby. Si no, muestra el Login. */}
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