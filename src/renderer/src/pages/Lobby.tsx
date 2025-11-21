import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby: FC = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/');
    }
    return (
        <>
            <div id='envoltorio-contenido-lobby' className='border p-4 flex flex-col justify-start'>
                <button onClick={goToHome} className=' w-20 rounded-md border-2 border-green-500 ml-4 px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white transition'>
                    Home
                </button>
                <div id='envoltorio-contenido-lobby' className='border border-yellow-400 w-screen h-screen flex justify-center '>
                    <div id='titulo-lobby' className='border border-red-500 w-screen'>
                        <div className='border border-blue-600  bg-sky-500 flex justify-center m-28 rounded-md '>
                            <p>Página del lobby</p>
                        </div>
                    <p>hola </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Lobby;
