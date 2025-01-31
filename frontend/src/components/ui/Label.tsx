import React from 'react';

interface LabelProps {
    htmlFor: string;
    className?: string; // Asegúrate de que className sea opcional
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({ htmlFor, className = '', children }) => (
    <label htmlFor={htmlFor} className={className}>
        {children}
    </label>
);

export default Label;
