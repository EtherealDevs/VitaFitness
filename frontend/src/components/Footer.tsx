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
                        {/* <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
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
                        </ul> */}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
                        <div className="flex space-x-4">
                            <Link href="#" target='_blank' className="text-white hover:text-green-400">
                                Facebook
                            </Link>
                            <Link href="https://www.instagram.com/vitafitness.ctes/" target='_blank' className="text-white hover:text-green-400">
                                Instagram
                            </Link>
                            <Link href="#" target='_blank' className="text-white hover:text-green-400">
                                WhatsApp
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p>&copy; 2025 Vita Fitness GYM. Todos los derechos reservados.</p>
                </div>
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>
                        <span className='mr-2' />Desarrolado por {' '}
                        <a href='https://www.etherealdevs.com/' target='_blank' className='italic hover:text-blue-600'>
                            Ethereal Devs
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer

