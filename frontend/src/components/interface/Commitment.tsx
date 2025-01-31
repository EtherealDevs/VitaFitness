const Commitment = () => {
    return (
        <section id="commitment" className="py-16 bg-black">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">Nuestro Compromiso</h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <img
                            src="/placeholder.svg?height=400&width=600&text=Nuestro+Compromiso"
                            alt="Nuestro Compromiso"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                    <div>
                        <p className="text-lg mb-6">
                            En Vita Fitness GYM, nos comprometemos a proporcionar un ambiente inclusivo y motivador donde cada miembro
                            pueda alcanzar sus metas de fitness y bienestar.
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Equipos de última generación y mantenidos regularmente</li>
                            <li>Entrenadores certificados y apasionados</li>
                            <li>Variedad de clases para todos los niveles y preferencias</li>
                            <li>Ambiente limpio y seguro</li>
                            <li>Comunidad de apoyo y motivación mutua</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Commitment

