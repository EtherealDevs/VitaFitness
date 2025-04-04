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
} from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Calendar } from '../../components/ui/calendar'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../components/ui/table'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Mail, Phone, Edit2 } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../components/ui/dialog'
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
    const [teacherSchedules, setTeacherSchedules] = useState<
        { id: number; day: string; start_time: string; end_time: string }[]
    >([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date(),
    )
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPhone, setIsEditingPhone] = useState(false)
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)

    const { getTeacher, updateTeacher } = useTeachers()
    const { getTeacherSchedules, createTeacherSchedule } = useTeacherSchedules()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getTeacher(id)
                setTeacher(response.teacher)
            } catch (error) {
                console.error('Error fetching teacher:', error)
            }

            try {
                const response = await getTeacherSchedules()
                // Filtrar horarios para este profesor
                const teacherSchedules = response.teacher_schedules.filter(
                    (schedule: { teacher: { id: number } }) =>
                        schedule.teacher.id === Number.parseInt(id),
                )
                setTeacherSchedules(teacherSchedules)
            } catch (error) {
                console.error('Error fetching schedules:', error)
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
            })
            setIsEditingEmail(false)
            setIsEditingPhone(false)
        } catch (error) {
            console.error('Error updating teacher:', error)
        }
    }

    const handleAddSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append('teacher_id', id)

        try {
            await createTeacherSchedule(formData)
            setIsScheduleModalOpen(false)
            // Recargar horarios
            const response = await getTeacherSchedules()
            const teacherSchedules = response.teacher_schedules.filter(
                (schedule: { teacher: { id: number } }) =>
                    schedule.teacher.id === Number.parseInt(id),
            )
            setTeacherSchedules(teacherSchedules)
        } catch (error) {
            console.error('Error creating schedule:', error)
        }
    }

    if (!teacher) {
        return <div className="p-6">Cargando...</div>
    }

    // Crear un array de fechas con clases para el calendario
    const scheduleDates = teacherSchedules.map((schedule: { day: string }) => {
        // Convertir el día de la semana a un número de fecha para visualización
        // Esto es simplificado, en una app real necesitarías mapear los días correctamente
        const dayMap: { [key: string]: number } = {
            LUN: 1,
            MAR: 2,
            MIE: 3,
            JUE: 4,
            VIE: 5,
            SAB: 6,
            DOM: 7,
        }
        return dayMap[schedule.day] || 1
    })

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        {teacher.name} {teacher.last_name}
                    </h1>
                    <Badge variant="success" className="mt-2">
                        AL DIA
                    </Badge>
                </div>
                <div className="flex gap-2">
                    <Button>Generar Pago</Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsScheduleModalOpen(true)}>
                        Horarios Nuevos
                    </Button>
                </div>
            </div>

            {/* Contact Info */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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

                <Card>
                    <CardHeader>
                        <CardTitle>Calendario de Clases</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                            modifiers={{
                                booked: date =>
                                    scheduleDates.includes(date.getDate()),
                            }}
                            modifiersStyles={{
                                booked: {
                                    backgroundColor: 'hsl(var(--primary))',
                                    color: 'white',
                                },
                            }}
                        />
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
                        <TableBody>
                            {teacherSchedules.map(
                                (schedule: {
                                    id: number
                                    day: string
                                    start_time: string
                                    end_time: string
                                }) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell>{schedule.day}</TableCell>
                                        <TableCell>
                                            {schedule.start_time}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.end_time}
                                        </TableCell>
                                    </TableRow>
                                ),
                            )}
                            {teacherSchedules.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center py-4">
                                        No hay horarios programados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Modal para agregar horario */}
            <Dialog
                open={isScheduleModalOpen}
                onOpenChange={setIsScheduleModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Nuevo Horario</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddSchedule} className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="day">Día</Label>
                                <select
                                    id="day"
                                    name="day"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required>
                                    <option value="">Seleccione un día</option>
                                    <option value="LUN">Lunes</option>
                                    <option value="MAR">Martes</option>
                                    <option value="MIE">Miércoles</option>
                                    <option value="JUE">Jueves</option>
                                    <option value="VIE">Viernes</option>
                                    <option value="SAB">Sábado</option>
                                    <option value="DOM">Domingo</option>
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="start_time">
                                    Horario de Inicio
                                </Label>
                                <Input
                                    id="start_time"
                                    name="start_time"
                                    type="time"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_time">
                                    Horario de Finalización
                                </Label>
                                <Input
                                    id="end_time"
                                    name="end_time"
                                    type="time"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsScheduleModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar Horario</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
