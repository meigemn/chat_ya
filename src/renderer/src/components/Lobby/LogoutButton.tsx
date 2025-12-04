import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        {...props} 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        className="h-5 w-5 mr-2"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
);

export default function LogoutButton() {
    const navigate = useNavigate();
    
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        // 1. Limpiar el almacenamiento local (eliminar el token y la info del usuario)
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        
        // Opcional: limpiar cualquier otro estado global si estás usando Context/Redux

        // 2. Redirigir al usuario a la página de login
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout} // Llamar a la función de cierre de sesión
            // He ajustado ligeramente las clases para incluir el icono y hacerlo más legible
            className='rounded-md border-2 border-red-500 ml-4 px-4 py-2 text-red-500 hover:bg-red-500 hover:text-white transition h-[7vh] w-[12vw] flex items-center justify-center font-medium'
        >
            <LogOutIcon />
            Cerrar Sesión
        </button>
    );
}