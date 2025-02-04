import Link from 'next/link'

// Agregar el tipo de props para NavLink
interface NavLinkProps {
    active?: boolean;
    href: string; // Asegúrate de que href sea requerido
    children: React.ReactNode;
    [key: string]: unknown; // Permitir otras props
}

const NavLink: React.FC<NavLinkProps> = ({ active = false, children, ...props }) => (
    <Link
        {...props}
        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out ${active
            ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:text-gray-700 focus:border-gray-300'
            }`}>
        {children}
    </Link>
)

export default NavLink
