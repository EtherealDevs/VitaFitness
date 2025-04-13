'use client'

import { useState } from 'react'
import { GradientTitle } from '@/components/ui/gradient-title'
import { Title } from '@/components/ui/title'
import Button from '@/components/ui/Button'
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react'
import Link from 'next/link'

export default function Contact() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email || !message) {
            alert('Por favor completa todos los campos.')
            return
        }

        const fullMessage = `Hola, me llamo ${name}, mi mail es ${email} y tengo la siguiente duda: ${message}`
        const phone = '3794798404'
        const encoded = encodeURIComponent(fullMessage)
        const whatsappURL = `https://wa.me/${phone}?text=${encoded}`

        window.open(whatsappURL, '_blank')

        // (Opcional) Limpiar campos después
        setName('')
        setEmail('')
        setMessage('')
    }

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
                        {/* <Link
                            href=""
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Linkedin className="w-4 h-4 text-black" />
                        </Link> */}
                        <Link
                            href="https://www.facebook.com/vitafitness.ctes/?locale=es_LA"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Facebook className="w-4 h-4 text-black" />
                        </Link>
                        <Link
                            href="https://www.instagram.com/vitafitness.ctes/?hl=es"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <Instagram className="w-4 h-4 text-black" />
                        </Link>
                        <Link
                            href="https://wa.me/3794723175?text=Hola%2C%20tengo%20esta%20duda"
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:opacity-80 transition-all">
                            <MessageCircle className="w-4 h-4 text-black" />
                        </Link>
                    </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="bg-gray-800 p-8 rounded-lg">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Nombre y Apellido"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Mensaje"
                                rows={3}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-transparent border-b border-gray-600 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors resize-none"
                                required
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