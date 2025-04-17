'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { Button } from '@/app/admin/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Branch {
    id: number
    name: string
}

export default function CreateTeacherView({
    branches,
}: {
    branches: Branch[]
}) {
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
        branch_id: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // lógica para guardar profesor
        console.log('Crear profesor:', form)
    }

    return (
        <div className=" max-w-xl mx-auto mt-10">
            <Card>
                <CardHeader>
                    <CardTitle>Agregar Profesor</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Apellido"
                                    value={form.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Teléfono"
                                    value={form.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    name="dni"
                                    placeholder="DNI"
                                    value={form.dni}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select
                                    id="branch_id"
                                    name="branch_id"
                                    value={form.branch_id}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border rounded-md shadow-sm p-2 text-sm dark:bg-zinc-900 dark:text-white">
                                    <option value="">
                                        Seleccione una sucursal
                                    </option>
                                    {branches?.map(branch => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
