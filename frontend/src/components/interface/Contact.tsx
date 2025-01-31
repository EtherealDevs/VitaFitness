'use client'

import { GradientTitle } from '@/components/ui/gradient-title'
import { Title } from '@/components/ui/title'
import Button from '@/components/ui/button'
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react'

export default function Contact() {
    return (
        <section id="contact" className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <GradientTitle className="mb-16">Contact</GradientTitle>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column */}
                    <div className="space-y-12">
                        <p className="text-lg text-gray-300 max-w-md">
                            Listo para empezar la transformacion. Nuestro equipo
                            encontrará el plan perfecto para ti y responder
                            todas las preguntas que tengas. Contáctanos y te
                            respondemos todas las dudas.
                        </p>

                        <div className="space-y-4">
                            <Title className="text-2xl mb-6">
                                REDES SOCIALES
                            </Title>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-[#0077B5] bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all">
                                    <Linkedin className="w-6 h-6 text-[#0077B5]" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-[#1877F2] bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all">
                                    <Facebook className="w-6 h-6 text-[#1877F2]" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-[#E4405F] bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all">
                                    <Instagram className="w-6 h-6 text-[#E4405F]" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-[#25D366] bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all">
                                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form */}
                    <div className="bg-gray-900 rounded-lg p-8">
                        <form className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Nombre y Apellido"
                                    className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Mensaje"
                                    rows={4}
                                    className="w-full bg-transparent border-b border-gray-700 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    className="bg-white text-black hover:bg-gray-100 px-8 py-2 rounded-full font-semibold flex items-center gap-2">
                                    Enviar
                                    <span className="text-xl">→</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
