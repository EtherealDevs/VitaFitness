import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    return (
        <nav className="bg-black py-4 px-8">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src="/img/LogoVita.png"
                        alt="Vita Fitness Logo"
                        width={100}
                        height={40}
                        className="object-contain"
                    />
                </Link>

                {/* Menú de navegación */}
                <div className="flex space-x-8 text-white text-sm font-semibold">
                    <Link href="/" className="hover:text-gray-300">Inicio</Link>
                    <Link href="#services" className="hover:text-gray-300">Planes</Link>
                    <Link href="#productos" className="hover:text-gray-300">Productos</Link>
                    <Link href="#compromiso" className="hover:text-gray-300">Nuestro Compromiso</Link>
                    <Link href="#resenas" className="hover:text-gray-300">Reseñas</Link>
                    <Link href="#contact" className="hover:text-gray-300">Contacto</Link>
                </div>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src="/avatar.png"
                        alt="Usuario"
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navbar
