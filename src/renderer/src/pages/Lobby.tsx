import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby: FC = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/');
    }
    return (
        <>
            <div id='envoltorio-contenido-lobby' className=' w-screen h-screen border border-purple-700 px-4 flex flex-col justify-start'>
                <button onClick={goToHome} className=' w-20 rounded-md border-2 border-green-500 ml-4 px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white transition'>
                    Home
                </button>
                <div id='envoltorio-contenido-lobby' className='border border-yellow-400  flex justify-center w-full '>
                    <div id='titulo-lobby' className='w-full border border-red-500 '>
                        <div className='border border-blue-600  bg-sky-500 flex justify-center mt-4 rounded-md '>
                            <p>Página del lobby</p>
                        </div>
                        <div className='border flex flex-row' >
                            <p className='border border-lime-500 w-[40vw]' >izquierd </p>
                            <p className='w-[60vw] border'>derecho</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Lobby;
