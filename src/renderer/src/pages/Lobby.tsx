import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const Lobby: FC = () => {
    const navigate = useNavigate();
    const goToHome = () => {
        navigate('/');
    }
    return (
        <>
            <button onClick={goToHome}  className='rounded-full border-2 border-green-500 px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white transition'>
                Home
            </button>
            <div id='titulo-lobby-y-boton' className='border border-red-500'>
            <div className='border border-blue-600'>
                <p>Página del lobby</p>
            </div>
            </div>
        </>
    )
}
export default Lobby;
