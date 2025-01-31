import Link from 'next/link'
import { Menu } from '@headlessui/react'
import { ReactNode } from 'react';
import React from 'react';

interface DropdownLinkProps {
    children: ReactNode;
    href: string;
    className?: string;
}

const DropdownLink = ({ children, href, ...props }: DropdownLinkProps) => (
    <Menu.Item>
        {({ active }) => (
            <Link
                href={href}
                {...props}
                className={`w-full text-left block px-4 py-2 text-sm leading-5 text-gray-700 ${active ? 'bg-gray-100' : ''
                    } focus:outline-none transition duration-150 ease-in-out`}>
                {children}
            </Link>
        )}
    </Menu.Item>
)

interface DropdownButtonProps {
    onClick: () => void;
    children: React.ReactNode;
}

export const DropdownButton: React.FC<DropdownButtonProps> = ({ onClick, children }) => (
    <button onClick={onClick} className="dropdown-button-class">
        {children}
    </button>
);

export default DropdownLink
