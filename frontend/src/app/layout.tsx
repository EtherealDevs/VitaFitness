import '@/app/globals.css'
import type React from 'react'

export const metadata = {
    title: 'Vita Fitness GYM',
    description: 'Transforma tu cuerpo, mente y vida en Vita Fitness GYM',
    keywords:
        'gym, fitness, entrenamiento, vida, salud, cuerpo, mente, transformación',
    icons: {
        icon: '/favicon.ico', // Para navegadores normales
        shortcut: '/favicon.ico', // Para accesos directos
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <head>
                <link
                    href="https://fonts.cdnfonts.com/css/impact"
                    rel="stylesheet"
                />
            </head>
            <body className="bg-black text-white">{children}</body>
        </html>
    )
}
