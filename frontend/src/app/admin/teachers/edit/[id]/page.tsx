'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useTeachers } from '@/hooks/teachers'
import { useTeacherSchedules } from '@/hooks/teacherSchedules'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../components/ui/table'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Mail, Phone, Edit2, User } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function TeacherProfile() {
    interface Teacher {
        id: number
        name: string
        last_name: string
        email: string
        phone: string
    }
    const { id } = useParams() as { id: string }
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPhone, setIsEditingPhone] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingLastName, setIsEditingLastName] = useState(false)
    const { getTeacher, updateTeacher } = useTeachers()
    const { getTeacherSchedules } = useTeacherSchedules()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTeacher(id)
                setTeacher(response.teacher)
            } catch (error) {
                console.error('Error fetching teacher:', error)
            }
        }

        fetchData()
    }, [id, getTeacher, getTeacherSchedules])

    const handleUpdateTeacher = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        try {
            await updateTeacher(id, formData)
            // Actualizar el estado local
            setTeacher({
                ...teacher!,
                email:
                    (formData.get('email') as string) || teacher?.email || '',
                phone:
                    (formData.get('phone') as string | null) ??
                    teacher?.phone ??
                    '',
                name:
                    (formData.get('name') as string | null) ??
                    teacher?.name ??
                    '',
                last_name:
                    (formData.get('last_name') as string | null) ??
                    teacher?.last_name ??
                    '',
            })
            setIsEditingEmail(false)
            setIsEditingPhone(false)
            setIsEditingName(false)
            setIsEditingLastName(false)
        } catch (error) {
            console.error('Error updating teacher:', error)
        }
    }

    if (!teacher) {
        return <div className="p-6">Cargando...</div>
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {teacher.name} {teacher.last_name}
                    </h1>
                </div>
            </div>

            {/* Contact Info */}
            <div className=" gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name and Last Name Form - Side by side */}
                        <form onSubmit={handleUpdateTeacher}>
                            <div className="flex items-start space-x-4">
                                <User className="h-4 w-4 text-muted-foreground mt-8" />
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Nombre */}
                                    <div>
                                        <Label>Nombre</Label>
                                        <div className="flex items-center gap-2">
                                            {isEditingName ? (
                                                <Input
                                                    name="name"
                                                    defaultValue={teacher.name}
                                                    autoFocus
                                                />
                                            ) : (
                                                <Input
                                                    value={teacher.name}
                                                    readOnly
                                                />
                                            )}
                                            {isEditingName ? (
                                                <Button type="submit" size="sm">
                                                    Guardar
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setIsEditingName(true)
                                                    }>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Apellido */}
                                    <div>
                                        <Label>Apellido</Label>
                                        <div className="flex items-center gap-2">
                                            {isEditingLastName ? (
                                                <Input
                                                    name="last_name"
                                                    defaultValue={
                                                        teacher.last_name
                                                    }
                                                    autoFocus
                                                />
                                            ) : (
                                                <Input
                                                    value={teacher.last_name}
                                                    readOnly
                                                />
                                            )}
                                            {isEditingLastName ? (
                                                <Button type="submit" size="sm">
                                                    Guardar
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        setIsEditingLastName(
                                                            true,
                                                        )
                                                    }>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Email Form */}
                        <form onSubmit={handleUpdateTeacher}>
                            <div className="flex items-center space-x-4">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <Label>Correo elect.</Label>
                                    <div className="flex items-center gap-2">
                                        {isEditingEmail ? (
                                            <Input
                                                name="email"
                                                defaultValue={teacher.email}
                                                autoFocus
                                            />
                                        ) : (
                                            <Input
                                                value={teacher.email}
                                                readOnly
                                            />
                                        )}
                                        {isEditingEmail ? (
                                            <Button type="submit" size="sm">
                                                Guardar
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    setIsEditingEmail(true)
                                                }>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Phone Form */}
                        <form onSubmit={handleUpdateTeacher}>
                            <div className="flex items-center space-x-4">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1">
                                    <Label>Teléfono</Label>
                                    <div className="flex items-center gap-2">
                                        {isEditingPhone ? (
                                            <Input
                                                name="phone"
                                                defaultValue={teacher.phone}
                                                autoFocus
                                            />
                                        ) : (
                                            <Input
                                                value={teacher.phone}
                                                readOnly
                                            />
                                        )}
                                        {isEditingPhone ? (
                                            <Button type="submit" size="sm">
                                                Guardar
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    setIsEditingPhone(true)
                                                }>
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Classes */}
            <Card>
                <CardHeader>
                    <CardTitle>Clases Próximas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Día</TableHead>
                                <TableHead>Horario de inicio</TableHead>
                                <TableHead>Horario de finalización</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
