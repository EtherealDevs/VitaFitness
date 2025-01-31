import React from 'react';

interface InputErrorProps {
    messages?: string[]; // Asegúrate de que messages sea un array de strings
    className?: string;
}

const InputError: React.FC<InputErrorProps> = ({ messages, className }) => {
    if (!messages || messages.length === 0) return null;

    return (
        <div className={`text-red-600 ${className}`}>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
        </div>
    );
};

export default InputError;
