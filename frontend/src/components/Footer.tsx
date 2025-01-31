import Link from "next/link"

const Footer = () => {
    return (
        <footer className="bg-black py-8">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Vita Fitness GYM</h3>
                        <p>Transformando vidas a través del fitness y el bienestar.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="#services" className="hover:text-green-400">
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link href="#commitment" className="hover:text-green-400">
                                    Compromiso
                                </Link>
                            </li>
                            <li>
                                <Link href="#reviews" className="hover:text-green-400">
                                    Reseñas
                                </Link>
                            </li>
                            <li>
                                <Link href="#contact" className="hover:text-green-400">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white hover:text-green-400">
                                Facebook
                            </a>
                            <a href="#" className="text-white hover:text-green-400">
                                Instagram
                            </a>
                            <a href="#" className="text-white hover:text-green-400">
                                Twitter
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p>&copy; 2023 Vita Fitness GYM. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

