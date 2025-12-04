import React from 'react';

interface ChatItemProps {
    name: string;
    lastMessage: string;
    onClick: () => void;
}

export default function ChatItem({ name, lastMessage, onClick }: ChatItemProps) {
    return (
        <div className='bg-blue-400 w-[19.7vw] flex justify-center my-4 rounded-sm p-1 hover:bg-blue-500 transition-colors'>
            <button onClick={onClick} className='w-full h-[5vh] flex items-center gap-2 p-2 rounded-sm'>
                <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-white'>
                    ✉️
                </div>
                <div className='flex-1 flex flex-col items-start truncate'>
                    <span className='text-sm font-medium text-white truncate'>
                        {name}
                    </span>
                    <span className='text-xs text-green-100 truncate'>
                        {lastMessage}
                    </span>
                </div>
            </button>
        </div>
    );
}
