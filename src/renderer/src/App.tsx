import { Routes, Route, useNavigate } from 'react-router-dom';

import Lobby from './pages/Lobby';
import Login from './components/Login/Login'
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
          <div>
            <Login />
          </div>
        </div>
      </div>

    </div>
  );
}


export default App;
