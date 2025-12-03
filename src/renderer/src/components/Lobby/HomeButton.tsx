import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomeButton() {
    const navigate = useNavigate();
    const goToHome = () => navigate('/');

    return (
        <button
            onClick={goToHome}
            className='rounded-md border-2 border-green-500 ml-4 px-4 py-2 text-green-500 hover:bg-green-500 hover:text-white transition h-[7vh] w-[8vw] flex justify-center  '
        >
            Home
        </button>
    );
}
