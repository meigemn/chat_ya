import React from 'react';

interface CreateChatButtonProps {
    onClick: () => void;
}

export default function CreateChatButton({ onClick }: CreateChatButtonProps) {
    return (
        <div
            id='crear-nuevo-chat'
            className='bg-green-400 w-[10vw] flex justify-center my-4 rounded-md cursor-pointer hover:bg-green-600 transition hover:-translate-y-1'
        >
            <button onClick={onClick} className='h-[4vh]'>
                Crear nuevo chat
            </button>
        </div>
    );
}
