import React from 'react';

interface CreateChatButtonProps {
    onClick: () => void;
}

export default function CreateChatButton({ onClick }: CreateChatButtonProps) {
    return (
        <div
            id='crear-nuevo-chat'
            className='  mx-4 px-4 py-2 bg-yellow-400 w-[10vw] h-[10vh] flex justify-center my-4 rounded-md cursor-pointer hover:bg-yellow-600 transition hover:-translate-y-0.5'
        >
            <button onClick={onClick} className='h-[4vh]'>
                Crear nuevo chat
            </button>
        </div>
    );
}
