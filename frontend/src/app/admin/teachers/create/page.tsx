'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { Button } from '@/app/admin/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTeachers } from '@/hooks/teachers'

export default function CreateTeacherView() {
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
    })
    const { createTeacher } = useTeachers()

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // lógica para guardar profesor
        const formData = new FormData()
        formData.append('name', form.name)
        formData.append('last_name', form.last_name)
        formData.append('email', form.email)
        formData.append('phone', form.phone)
        formData.append('dni', form.dni)

        try {
            const response = await createTeacher(formData)
            const data = await response
            console.log(data)
            alert('Profesor creado exitosamente')
            router.push('/admin/teachers')
        } catch (error) {
            console.error('Error al crear el profesor:', error)
            alert('Error al crear el profesor')
            throw error
        }
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
