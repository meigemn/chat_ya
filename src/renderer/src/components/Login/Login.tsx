import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../hooks/useAuth'; 
// Importamos 'User' directamente para construir el objeto completo
import { ILoginRequest, ILoginResponse, IGenericError, User } from '@renderer/types/auth'; 

// Define la URL base de API de .NET (Usando la del usuario: 7201)
const API_BASE_URL = 'https://localhost:7201'; 

// Componente SVG para el icono de "Mostrar Contraseña" (Ojo abierto)
const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        className="h-5 w-5"
    >
        <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

// Componente SVG para el icono de "Ocultar Contraseña" (Ojo tachado)
const EyeSlashIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
        className="h-5 w-5"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-5.16 0-9.4-3.32-11.2-8a.93.93 0 0 1 0-.08" />
        <path d="M2.06 4.06A16 16 0 0 0 12 16a3 3 0 1 0 0-6" />
        <path d="M22 2l-20 20" />
    </svg>
);


export default function Login() {
    // 1. HOOKS DE NAVEGACIÓN Y AUTENTICACIÓN
    const navigate = useNavigate(); 
    // 🔑 Obtener el estado y la función 'login' del contexto
    const { login, isAuthenticated } = useAuth(); 

    // 2. ESTADOS DEL FORMULARIO Y VISIBILIDAD
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    // 3. ESTADOS DE UI Y ERRORES
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 🔑 4. LÓGICA DE REDIRECCIÓN BASADA EN EL CONTEXTO
    useEffect(() => {
        if (isAuthenticated) {
            // Si isAuthenticated es true, redirigimos a lobby
            console.log("Autenticación detectada en el contexto. Redirigiendo a /lobby.");
            navigate('/lobby', { replace: true });
        } else {
            // Añadido log para ayudar a diagnosticar problemas de logout
            console.log("Usuario NO autenticado. Mostrando formulario de Login.");
        }
    }, [isAuthenticated, navigate]); 


    // 5. MANEJADOR DEL SUBMIT (LÓGICA DE CONEXIÓN A LA API)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); 
        setIsLoading(true);

        const loginData: ILoginRequest = { email, password };

        try {
            // Petición POST al endpoint /api/auth/login
            const response = await axios.post<ILoginResponse>(
                `${API_BASE_URL}/api/auth/login`,
                loginData
            );

            // RESPUESTA EXITOSA (Status 200 OK)
            const { token, user: userDto } = response.data;
            
            // ✅ CORRECCIÓN: Construir el objeto 'User' completo 
            // usando los datos del DTO (id, userName) y el email del estado local.
            const authenticatedUser: User = {
                id: userDto.id,
                email: email, // <--- Aquí se añade la propiedad faltante
                userName: userDto.userName,
            };

            // Ahora llamamos a 'login' con el objeto 'User' completo.
            login({ token, user: authenticatedUser }); 
            
        } catch (err) {
            // MANEJO DE ERRORES (400, 401, 500, etc.)
            const axiosError = err as AxiosError<IGenericError>;
            
            if (axiosError.response) {
                const backendError = axiosError.response.data;
                setError(backendError.message || 'Error desconocido del servidor.');
            } else if (axiosError.request) {
                setError('Error de red: No se pudo conectar con la API. Verifica que el backend esté corriendo.');
            } else {
                setError('Ha ocurrido un error inesperado al procesar la solicitud.');
            }
            
        } finally {
            setIsLoading(false);
        }
    };

    // 6. ESTRUCTURA Y UI DEL FORMULARIO
    if (isAuthenticated) {
        return <div className="text-center text-lg text-gray-500">Iniciando sesión...</div>;
    }

    return (
        <div className="flex items-center justify-center  ">
            <div className="w-full max-w-md p-8 space-y-6  rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-center text-3xl font-extrabold text-white-900">
                    Iniciar Sesión
                </h2>
                <div>
                    Credenciales:
                    <ul className="list-disc list-inside text-sm text-gray-700">
                        <li className='select-text '>
                            Email: usuarioChatYa@gmail.com
                        </li>
                        <li className='select-text '>Contraseña: usuarioChatYa1234! </li>
                    </ul>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>

                    {/* Campo de Email */}
                    <div className='text-black'>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-white "
                        >
                            Email
                        </label>
                        <input
                            type="email" 
                            id="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm "
                            placeholder="correo@ejemplo.com"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Campo de Contraseña */}
                    <div className='text-black'>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>

                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm pr-10"
                                placeholder="Mínimo 8 caracteres"
                                disabled={isLoading}
                            />

                            <button
                                type="button" 
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </button>
                        </div>
                    </div>
                    
                    {/* Mensaje de Error */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                            {error}
                        </div>
                    )}


                    {/* Botón de Envío */}
                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={isLoading} 
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Acceder'
                            )}
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    );
}