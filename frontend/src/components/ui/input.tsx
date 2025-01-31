import React, { ChangeEvent } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    type: string;
    name: string;
    value: string;
    className?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    autoFocus?: boolean;
    autoComplete?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ autoComplete, ...props }, ref) => {
    return (
        <input
            ref={ref}
            autoComplete={autoComplete}
            {...props}
        />
    );
});

export default Input;
