import { GradientTitle } from '@/components/ui/gradient-title'
import Image from 'next/image'

const Commitment = () => {
    return (
        <section id="commitment" className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div>
                        <GradientTitle>Nuestro Compromiso</GradientTitle>
                        <p className="text-lg mb-12 text-gray-300">
                            Descubre los diferentes planes que ofrecemos para
                            adaptarnos a tus necesidades y objetivos de fitness.
                            ¡Elige el que mejor se ajuste a ti y comienza tu
                            transformación hoy mismo
                        </p>

                        <div className="mt-16">
                            <GradientTitle>Nuestras Sedes</GradientTitle>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src="/placeholder.svg?height=200&width=300"
                                        alt="Corrientes"
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                                        <h3 className="text-2xl font-bold text-white">
                                            CORRIENTES
                                        </h3>
                                        <p className="text-gray-300">
                                            Avenida Ferre 15667
                                        </p>
                                    </div>
                                </div>
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src="/placeholder.svg?height=200&width=300"
                                        alt="Corrientes"
                                        width={300}
                                        height={200}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4">
                                        <h3 className="text-2xl font-bold text-white">
                                            CORRIENTES
                                        </h3>
                                        <p className="text-gray-300">
                                            España y Belgrano
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Separator */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white opacity-20" />

                    {/* Right Column */}
                    <div>
                        <div className="mb-12">
                            <h3 className="text-2xl font-bold mb-4">
                                ¿POR QUÉ ELEGIR A VITA?
                            </h3>
                            <p className="text-gray-300">
                                The smartest & most effective workout in 50
                                minutes. VITA is functional fitness at its
                                finest & will have your body feeling strong &
                                sculpted fast.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {/* Results Card */}
                            <div className="relative overflow-hidden rounded-lg h-64">
                                <Image
                                    src="/placeholder.svg?height=300&width=500"
                                    alt="Resultados"
                                    width={500}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 p-6 flex flex-col justify-between">
                                    <h3 className="text-3xl font-bold text-white">
                                        RESULTADOS
                                    </h3>
                                    <p className="text-gray-300">
                                        En vita fitnes nuestros miembros
                                        experimentan mejoras en resistencia,
                                        cardio, energía
                                    </p>
                                </div>
                            </div>

                            {/* Vision Card */}
                            <div className="relative overflow-hidden rounded-lg h-64">
                                <Image
                                    src="/placeholder.svg?height=300&width=500"
                                    alt="Nuestra Visión"
                                    width={500}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-60 p-6 flex flex-col justify-between">
                                    <h3 className="text-3xl font-bold text-white">
                                        NUESTRA VISIÓN
                                    </h3>
                                    <p className="text-gray-300">
                                        En vita fitness nuestra visión es
                                        ofrecer un ambiente inclusivo y
                                        motivador donde cualquier persona pueda
                                        alcanzar sus objetivos de bienestar y
                                        salud.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Commitment
