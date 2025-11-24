import { Routes, Route, useNavigate } from 'react-router-dom';

import Lobby from './pages/Lobby';

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

function Home() {
  const navigate = useNavigate();

  const goToLobby = () => {
    navigate('/lobby');
  };

  return (
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
        </div>
      </div>
      <div id='boton-redireccion-lobby' className='flex justify-start mt-4'>
        <button
          onClick={goToLobby}
          className='rounded-full border-2 border-blue-500 px-4 py-2 text-blue-500 hover:bg-blue-500 hover:text-white transition'
        >
          Lobby
        </button>
      </div>
    </div>
  );
}


export default App;
