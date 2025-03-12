'use client'
import { Plan, usePlans } from '@/hooks/plans'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function PlansPage() {
    const { getPlans } = usePlans()
    const [plans, setPlans] = useState<Plan[]>([])
    useEffect(() => {
        async function fetchPlans() {
            try {
                const response = await getPlans()
                console.log(response)
                setPlans(response.plans)
            } catch (error) {
                console.error(error)
                throw error
            }
        }
        fetchPlans()
    }, [getPlans])
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
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white p-4">
                hola
            </div>
        </div>
    )
}
