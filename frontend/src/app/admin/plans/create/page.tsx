'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { Plan, usePlans } from '@/hooks/plans'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CreatePlan() {
    const { createPlan } = usePlans()
    const router = useRouter()
    const [plan, setPlan] = useState<Plan>({
        id: '',
        name: '',
        description: '',
        status: 'activo',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target
        setPlan(prev => ({ ...prev, [name]: value }))
    }

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setPlan(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fromData = new FormData()
        fromData.append('name', plan.name)
        fromData.append('description', plan.description)
        fromData.append('status', plan.status)

        try {
            await createPlan(fromData)
            router.push('/admin/plans')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <Card>
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Crear Plan</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="name">Nombre del plan</Label>
                            <Input
                                id="name"
                                name="name"
                                value={plan.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">
                                Descripción del plan
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                className="dark:bg-[#393d40]"
                                value={plan.description}
                                onChange={handleTextareaChange}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="status">Estado del plan</Label>
                            <select
                                id="status"
                                name="status"
                                value={plan.status}
                                onChange={handleChange}
                                className="mt-1 block w-full dark:bg-[#393d40] border rounded-md shadow-sm p-2 text-sm ">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <Link
                                href="/admin/plans"
                                className="text-sm text-red-500 hover:underline">
                                Cancelar
                            </Link>
                            <Button type="submit">Crear Plan</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
