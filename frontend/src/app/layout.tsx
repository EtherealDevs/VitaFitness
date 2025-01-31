import "@/app/globals.css"
import { Inter } from "next/font/google"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Vita Fitness GYM",
    description: "Transforma tu cuerpo, mente y vida en Vita Fitness GYM",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={`${inter.className} bg-black text-white`}>{children}</body>
        </html>
    )
}

