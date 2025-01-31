// Agregar el tipo de props para Header
interface HeaderProps {
    title: string; // Definir title como una propiedad requerida de tipo string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {title}
                </h2>
            </div>
        </header>
    )
}

export default Header