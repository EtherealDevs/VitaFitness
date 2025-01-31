"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Button from "@/components/ui/Button"

interface PlanModalProps {
    isOpen: boolean
    onClose: () => void
    plan: {
        title: string
        description: string
        features: string[]
        price: string
        image: string
    }
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-900 text-white border-gray-800">
                <DialogHeader>
                    <DialogTitle className="gradient-text">{plan.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <img
                        src={plan.image || "/placeholder.svg"}
                        alt={plan.title}
                        className="w-full h-48 object-cover rounded-lg"
                    />
                    <p className="text-gray-300">{plan.description}</p>
                    <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-gradient-to-r from-green-400 to-purple-500 rounded-full" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold gradient-text">{plan.price}</span>
                        <Button className="bg-gradient-to-r from-green-400 to-purple-500 hover:opacity-90">Comenzar ahora</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

