'use client'
import { Plan, usePlans } from '@/hooks/plans'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function PlansPage() {
    const { getPlans, deletePlan } = usePlans()
    const [plans, setPlans] = useState<Plan[]>([])
    useEffect(() => {
        async function fetchPlans() {
            try {
                const response = await getPlans()
                setPlans(response.plans)
            } catch (error) {
                console.error(error)
                throw error
            }
        }
        fetchPlans()
    }, [getPlans])
    const handleDelete = async (id: string) => {
        try {
            await deletePlan(id)
            setPlans(plans.filter(plan => plan.id !== id))
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between">
                <div className="flex space-x-4">
                    <h1 className="text-4xl font-extrabold grid content-end">
                        Planes
                    </h1>
                    <button className="py-2 px-4 bg-blue-600  rounded-xl">
                        filtros
                    </button>
                </div>
                <Link
                    href="/admin/plans/create"
                    className="py-2 px-4 bg-blue-600  rounded-xl">
                    Crear plan
                </Link>
            </div>
            <div className="relative overflow-x-auto shadow-md rounded-md sm:rounded-lg bg-white p-4">
                {/* desktop view */}
                <table
                    className="w-full text-sm text-left text-gray-500 dark:text-gray-400
                ">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="rounded-lg">
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Descripcion</th>
                            <th className="p-2">Precio</th>
                            <th className="p-2">Status</th>
                            <th className="p-2" colSpan={2}>
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {plans.map(plan => (
                            <tr key={plan.id} className="hover:bg-gray-100">
                                <td className="p-2">{plan.name}</td>
                                <td className="p-2">{plan.price}</td>
                                <td className="p-2">{plan.description}</td>
                                <td className="p-2">{plan.status}</td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleDelete(plan.id)}
                                        className="text-red-600 hover:underline">
                                        Eliminar
                                    </button>
                                </td>
                                <td className="p-2">
                                    <Link
                                        href={`/admin/plans/edit/${plan.id}`}
                                        className="text-blue-600 hover:underline">
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* mobile view */}
            </div>
        </div>
    )
}
