import Link from 'next/link'
import Button from './ui/button'

const Navbar = () => {
    return (
        <nav className="bg-black py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-white">
                    Vita Fitness GYM
                </Link>
                <div className="space-x-4">
                    <Link
                        href="#services"
                        className="text-white hover:text-green-400">
                        Servicios
                    </Link>
                    <Link
                        href="#commitment"
                        className="text-white hover:text-green-400">
                        Compromiso
                    </Link>
                    <Link
                        href="#reviews"
                        className="text-white hover:text-green-400">
                        Reseñas
                    </Link>
                    <Link
                        href="#contact"
                        className="text-white hover:text-green-400">
                        Contacto
                    </Link>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                        Únete ahora
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
