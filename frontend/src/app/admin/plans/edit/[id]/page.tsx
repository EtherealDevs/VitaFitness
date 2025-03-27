'use client'
import Button from '@/components/ui/button'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { Textarea } from '@/components/ui/textarea'
import { Plan, usePlans } from '@/hooks/plans'
import { Select } from '@headlessui/react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EditPlan() {
    const { updatePlan, getPlan } = usePlans()
    const router = useRouter()
    const { id } = useParams()
    const [plan, setPlan] = useState<Plan>({
        id: '',
        name: '',
        description: '',
        price: 0,
        status: '',
    })

    const fetchPlan = async () => {
        try {
            const plan = await getPlan(id as string)
            setPlan(plan.plan)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchPlan()
    }, [id])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setPlan(prev => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const fromData = new FormData()
        fromData.append('name', plan.name)
        fromData.append('description', plan.description)
        fromData.append('price', plan.price.toString())
        fromData.append('status', plan.status)
        try {
            await updatePlan(id as string, fromData)
            router.push('/admin/plans')
        } catch (error) {
            console.error(error)
        }
    }

    const handleTextareaChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlan(prevPlan => ({
            ...prevPlan,
            [e.target.name]: e.target.value,
        }))
    }
    return (
        <div className="space-y-4">
            <div>
                <h1>Editar Plan</h1>
            </div>
            <div className="bg-white dark:bg-zinc-950 dark:text-white p-4 shadow-md rounded-md sm:rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4 m-3">
                    <div className="space-y-4">
                        <Label htmlFor="name">Nombre del plan</Label>
                        <Input
                            id="name"
                            className="w-full p-2 border rounded-lg dark:bg-transparent"
                            value={plan.name}
                            onChange={handleChange}
                            type="text"
                            name="name"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="description">
                            Descripción del plan
                        </Label>
                        <Textarea
                            className="w-full p-2 border rounded-lg dark:bg-transparent"
                            id="description"
                            value={plan.description}
                            onChange={handleTextareaChange}
                            name="description"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <Label htmlFor="price">Precio del plan</Label>
                            <Input
                                id="price"
                                className="w-full p-2 border rounded-lg dark:bg-transparent"
                                value={plan.price.toString()}
                                onChange={handleChange}
                                type="number"
                                name="price"
                            />
                        </div>
                        <div className="space-y-4">
                            <Label htmlFor="status">Estado del plan</Label>
                            <Select
                                id="status"
                                className="w-full p-2 border rounded-lg bg-white dark:bg-zinc-950 dark:text-white"
                                onChange={handleSelectChange}
                                name="status">
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <Link
                            href={'/admin/plans'}
                            className="bg-transparent border transition duration-500 border-red-400 text-red-400 hover:bg-red-400 hover:text-white font-bold py-2 px-4 rounded-lg ">
                            Cancelar
                        </Link>
                        <Button
                            type="submit"
                            className="bg-transparent border transition duration-500 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2 px-4 rounded-lg ">
                            Editar plan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
