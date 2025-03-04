"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

interface AccessCardProps {
    name: string
    paymentDate: string
}

function AccessCard({ name = "SOFIA ALARCON", paymentDate = "22 DE ABRIL" }: AccessCardProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            {/* Gradient background effect */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/40 via-emerald-600/30 to-black blur-3xl" />

            {/* Main content */}
            <div className="relative">
                <h1 className="text-4xl font-bold text-white text-center mb-6">ACCESO PERMITIDO</h1>

                <Card className="w-[400px] bg-white rounded-3xl p-8 flex flex-col items-center space-y-6">
                    {/* Logo */}
                    <div className="w-32 h-16 relative">
                        <Image src="/placeholder.svg" alt="VITA fitness" fill className="object-contain" priority />
                    </div>

                    {/* Access status */}
                    <p className="text-emerald-400 text-xl font-medium">ACCESO PERMITIDO</p>

                    {/* Member name */}
                    <h2 className="text-4xl font-black tracking-wide text-center">{name}</h2>

                    {/* Payment date */}
                    <div className="text-center space-y-1">
                        <p className="text-lg font-medium">FECHA DE PAGO:</p>
                        <p className="text-lg font-medium">{paymentDate}</p>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default function AccessPage() {
    return <AccessCard name="SOFIA ALARCON" paymentDate="22 DE ABRIL" />
}

