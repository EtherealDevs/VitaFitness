import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }: ButtonProps) => {
    return (
        <button
            className={`px-4 py-2 text-white bg-blue-500 rounded ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
