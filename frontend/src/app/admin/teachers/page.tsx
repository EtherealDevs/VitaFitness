'use client'
import { useState, useEffect, useCallback } from 'react'
import type React from 'react'

import { useTeachers } from '@/hooks/teachers'
import { useTeacherSchedules } from '@/hooks/teacherSchedules'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Link from 'next/link'

export interface Teacher {
    id: number
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
}

interface TeacherSchedule {
    id: number
    start_time: string
    end_time: string
    day: string
    teacher: { id: number; name: string; last_name: string }
}

export default function TeacherIndex() {
    // Fetch data from Teacher API
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [teacherSchedules, setTeacherSchedules] = useState<TeacherSchedule[]>(
        [],
    )
    useState(false)

    const [search, setSearch] = useState('')
    const { getTeachers, deleteTeacher } = useTeachers()
    const { getTeacherSchedules, deleteTeacherSchedule } = useTeacherSchedules()

    const fetchData = useCallback(async () => {
        try {
            const response = await getTeachers()
            setTeachers(response.teachers)
        } catch (error) {
            console.error(error)
            throw error
        }
        try {
            const response = await getTeacherSchedules()
            setTeacherSchedules(response.teacher_schedules)
        } catch (error) {
            console.error(error)
            throw error
        }
    }, [getTeachers, getTeacherSchedules])

    async function handleDeleteTeacher(id: number) {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este profesor?',
        )
        if (!confirmDelete) return

        try {
            await deleteTeacher(String(id))
            alert('Profesor eliminado correctamente')
            fetchData()
            setTeachers((prevTeachers: Teacher[]) =>
                prevTeachers.filter(teacher => teacher.id !== id),
            )
        } catch (error) {
            console.error('Error al eliminar el profesor:', error)
            alert('No se pudo eliminar el profesor')
        }
    }

    async function handleDeleteTeacherSchedule(id: number) {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este horario?',
        )
        if (!confirmDelete) return

        try {
            await deleteTeacherSchedule(String(id))
            alert('Horario eliminado correctamente')
            fetchData()
            setTeacherSchedules((prevTeacherSchedules: TeacherSchedule[]) =>
                prevTeacherSchedules.filter(
                    teacherSchedule => teacherSchedule.id !== id,
                ),
            )
        } catch (error) {
            console.error('Error al eliminar el horario:', error)
            alert('No se pudo eliminar el horario')
        }
    }

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Filtrar profesores según la búsqueda
    const filteredTeachers = teachers?.filter(
        (teacher: Teacher) =>
            teacher.name.toLowerCase().includes(search.toLowerCase()) ||
            teacher.last_name.toLowerCase().includes(search.toLowerCase()) ||
            teacher.email.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Profesores</h1>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar profesor..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Tabla de Profesores */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lista de Profesores</CardTitle>
                    <Link href={'/admin/teachers/create'}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Profesor
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Apellido</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Teléfono</TableHead>
                                    <TableHead>DNI</TableHead>
                                    {/* <TableHead>Sucursal</TableHead> */}
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeachers?.map((teacher: Teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>{teacher.id}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/teachers/${teacher.id}`}
                                                className="font-medium hover:underline">
                                                {teacher.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {teacher.last_name}
                                        </TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.phone}</TableCell>
                                        <TableCell>{teacher.dni}</TableCell>
                                        {/* <TableCell>
                                            {teacher.branch?.name}
                                        </TableCell> */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={`/admin/teachers/${teacher.id}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm">
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </Link>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteTeacher(
                                                            teacher.id,
                                                        )
                                                    }>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Tabla de Horarios */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Horarios de Profesores</CardTitle>
                    <Link href={'/admin/teacher-schedules/create'}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Horario
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Profesor</TableHead>
                                    <TableHead>Día</TableHead>
                                    <TableHead>Horario de inicio</TableHead>
                                    <TableHead>
                                        Horario de finalización
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacherSchedules?.map(
                                    (schedule: TeacherSchedule) => (
                                        <TableRow key={schedule.id}>
                                            <TableCell>{schedule.id}</TableCell>
                                            <TableCell>
                                                {schedule.teacher.name}{' '}
                                                {schedule.teacher.last_name}
                                            </TableCell>
                                            <TableCell>
                                                {schedule.day}
                                            </TableCell>
                                            <TableCell>
                                                {schedule.start_time}
                                            </TableCell>
                                            <TableCell>
                                                {schedule.end_time}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={`/admin/teachers/teacher-schedules/edit/${schedule.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm">
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteTeacherSchedule(
                                                                schedule.id,
                                                            )
                                                        }>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
