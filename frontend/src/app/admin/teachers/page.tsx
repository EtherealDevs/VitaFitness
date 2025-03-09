"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useTeachers } from "@/hooks/teachers"
import { useTeacherSchedules } from "@/hooks/teacherSchedules"
import { useBranches } from "@/hooks/branches"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import Link from "next/link"

export default function TeacherIndex() {
    // Fetch data from Teacher API
    const [teachers, setTeachers] = useState<any>([])
    const [teacherSchedules, setTeacherSchedules] = useState<any>([])
    const [branches, setBranches] = useState<any>([])
    const [isOpen, setIsOpen] = useState(false)
    const [scheduleModalIsOpen, setScheduleModalIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [selectedTeacher, setSelectedTeacher] = useState();
    const [selectedTeacherSchedule, setSelectedTeacherSchedule] = useState();
    const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeachers()
    const { getTeacherSchedules, updateTeacherSchedule, deleteTeacherSchedule } = useTeacherSchedules()
    const { getBranches } = useBranches()

    function open(id: number) {
        setIsOpen(true)
        setSelectedTeacher(teachers.find((teacher) => teacher.id === id))
    }
    function close() {
        setIsOpen(false)
    }
    function openScheduleModal(id: number) {
        setScheduleModalIsOpen(true)
        setSelectedTeacherSchedule(teacherSchedules.find((schedule) => schedule.id === id))
    }
    function closeScheduleModal() {
        setScheduleModalIsOpen(false)
    }

    const fetchData = async () => {
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
        try {
            const response = await getBranches()
            setBranches(response.branches)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    async function handleUpdateTeacherForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        var formData = new FormData(e.currentTarget)
        await updateTeacher(e.currentTarget.id.value, formData)
        close()
        fetchData()
    }

    async function handleUpdateTeacherSchedulesForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        var formData = new FormData(e.currentTarget)
        await updateTeacherSchedule(e.currentTarget.id.value, formData)
        closeScheduleModal()
        fetchData()
    }

    async function handleDeleteTeacher(id: number) {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este profesor?")
        if (!confirmDelete) return

        try {
            await deleteTeacher(String(id))
            alert("Profesor eliminado correctamente")
            setTeachers((prevTeachers: any[]) => prevTeachers.filter((teacher) => teacher.id !== id))
        } catch (error) {
            console.error("Error al eliminar el profesor:", error)
            alert("No se pudo eliminar el profesor")
        }
    }

    async function handleDeleteTeacherSchedule(id: number) {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar este horario?")
        if (!confirmDelete) return

        try {
            await deleteTeacherSchedule(String(id))
            alert("Horario eliminado correctamente")
            setTeacherSchedules((prevTeacherSchedules: any[]) =>
                prevTeacherSchedules.filter((teacherSchedule) => teacherSchedule.id !== id),
            )
        } catch (error) {
            console.error("Error al eliminar el horario:", error)
            alert("No se pudo eliminar el horario")
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Filtrar profesores según la búsqueda
    const filteredTeachers = teachers?.filter(
        (teacher: any) =>
            teacher.name.toLowerCase().includes(search.toLowerCase()) ||
            teacher.last_name.toLowerCase().includes(search.toLowerCase()) ||
            teacher.email.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="space-y-6 p-6">
            <form className="hidden" id="updateTeacherStub"><input type="hidden" name="id" /></form>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Profesores</h1>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Profesor
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar profesor..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Tabla de Profesores */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Profesores</CardTitle>
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
                                    <TableHead>Sucursal</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTeachers?.map((teacher: any) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell>{teacher.id}</TableCell>
                                        <TableCell>
                                            <Link href={`/admin/teachers/${teacher.id}`} className="font-medium hover:underline">
                                                {teacher.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{teacher.last_name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.phone}</TableCell>
                                        <TableCell>{teacher.dni}</TableCell>
                                        <TableCell>{teacher.branch?.name}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => open(teacher.id)}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDeleteTeacher(teacher.id)}>
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
                <CardHeader>
                    <CardTitle>Horarios de Profesores</CardTitle>
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
                                    <TableHead>Horario de finalización</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teacherSchedules?.map((schedule: any) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell>{schedule.id}</TableCell>
                                        <TableCell>
                                            {schedule.teacher.name} {schedule.teacher.last_name}
                                        </TableCell>
                                        <TableCell>{schedule.day}</TableCell>
                                        <TableCell>{schedule.start_time}</TableCell>
                                        <TableCell>{schedule.end_time}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openScheduleModal(schedule.id)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteTeacherSchedule(schedule.id)}
                                                >
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

            {/* Modal para editar profesor */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Profesor</DialogTitle>
                    </DialogHeader>
                    <form id="updateTeacherForm" onSubmit={handleUpdateTeacherForm} className="space-y-4">
                        <input type="hidden" name="id" value={selectedTeacher?.id}/>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input id="name" name="name" placeholder="Nombre" defaultValue={selectedTeacher?.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input id="last_name" name="last_name" placeholder="Apellido" defaultValue={selectedTeacher?.last_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="Email" defaultValue={selectedTeacher?.email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input id="phone" name="phone" placeholder="Teléfono" defaultValue={selectedTeacher?.phone}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni" name="dni" placeholder="DNI" defaultValue={selectedTeacher?.dni} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select
                                    id="branch_id"
                                    name="branch_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue={selectedTeacher?.branch.id}
                                >
                                    <option value="">Seleccione una sucursal</option>
                                    {branches?.map((branch: any) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={close}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal para editar horario */}
            <Dialog open={scheduleModalIsOpen} onOpenChange={setScheduleModalIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Horario</DialogTitle>
                    </DialogHeader>
                    <form id="updateTeacherSchedulesForm" onSubmit={handleUpdateTeacherSchedulesForm} className="space-y-4">
                        <input type="hidden" name="id" value={selectedTeacherSchedule?.id}/>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_time">Horario de Inicio</Label>
                                <Input id="start_time" name="start_time" type="time" defaultValue={selectedTeacherSchedule?.start_time}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end_time">Horario de Finalización</Label>
                                <Input id="end_time" name="end_time" type="time" defaultValue={selectedTeacherSchedule?.end_time} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="day">Día</Label>
                                <Input id="day" name="day" placeholder="Día" defaultValue={selectedTeacherSchedule?.day}/>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="teacher_id">Profesor</Label>
                                <select
                                    id="teacher_id"
                                    name="teacher_id"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    defaultValue={selectedTeacherSchedule?.teacher.id}
                                >
                                    <option value="">Seleccione un profesor</option>
                                    {teachers?.map((teacher: any) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.name} {teacher.last_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeScheduleModal}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar Cambios</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

