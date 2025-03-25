'use client'

import { GradientTitle } from '@/components/ui/gradient-title'
import { Title } from '@/components/ui/title'
import Button from '@/components/ui/Button'
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Contact() {
    return (
        <section id="contact" className="py-16 bg-black flex justify-center">
            <div className="container mx-auto px-4 max-w-4xl grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="bg-black p-8 rounded-lg text-white">
                    <GradientTitle className="mb-4 font-impact">
                        CONTACT
                    </GradientTitle>
                    <p className="text-gray-300 text-sm mb-6">
                        Listo para empezar la transformación. Nuestro equipo
                        encontrará el plan perfecto para ti y responder todas
                        las preguntas que tengas. Contáctanos y te respondemos
                        todas las dudas.
                    </p>
                    <Title className="text-lg mb-4">REDES SOCIALES</Title>
                    <div className="flex gap-4">
                        <Link
                            href="#"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Linkedin className="w-4 h-4 text-black" />
                        </Link>
                        <Link
                            href="#"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Facebook className="w-4 h-4 text-black" />
                        </Link>
                        <Link
                            href="#"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Instagram className="w-4 h-4 text-black" />
                        </Link>
                        <Link
                            href="#"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <MessageCircle className="w-4 h-4 text-black" />
                        </Link>
                    </div>
                </div>
                {/* Right Column - Contact Form */}
                <div className="bg-gray-800 p-8 rounded-lg">
                    <form className="space-y-6">
                        <div>
                            <input
                                type="text"
                                placeholder="Nombre y Apellido"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Mensaje"
                                rows={3}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-white text-black px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:bg-gray-300 transition-all">
                                Enviar <span className="text-lg">→</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}
