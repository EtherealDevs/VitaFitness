'use client'
import { useState, useEffect } from 'react'
import type React from 'react'

import { useStudents } from '@/hooks/students'
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../components/ui/dialog'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import Link from 'next/link'
import { useBranches } from '@/hooks/branches'

export default function StudentsPage() {
    const [students, setStudents] = useState<any>([])
    const [branches, setBranches] = useState<any>([])
    const [isOpen, setIsOpen] = useState(false)
    const [createStudentModalIsOpen, setCreateStudentModalIsOpen] =
        useState(false)
    const [selectedStudent, setSelectedStudent] = useState<any>()
    const [search, setSearch] = useState('')

    const { getStudents, createStudent, updateStudent, deleteStudent } =
        useStudents()
    const { getBranches } = useBranches();

    function open(id: number) {
        setIsOpen(true)
        setSelectedStudent(students.find(student => student.id === id))
    }

    function close() {
        setIsOpen(false)
    }

    function openCreateStudentModal() {
        setCreateStudentModalIsOpen(true)
    }

    function closeCreateStudentModal() {
        setCreateStudentModalIsOpen(false)
    }

    const fetchData = async () => {
        try {
            const response = await getStudents()
            setStudents(response.students)
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

    async function handleCreateStudentForm(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await createStudent(formData)
        closeCreateStudentModal()
        fetchData()
    }

    async function handleUpdateStudentForm(
        e: React.FormEvent<HTMLFormElement>,
    ) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await updateStudent(e.currentTarget.id.value, formData)
        close()
        fetchData()
    }

    async function handleDeleteStudent(id: number) {
        const confirmDelete = confirm(
            '¿Estás seguro de que deseas eliminar este alumno?',
        )
        if (!confirmDelete) return

        try {
            await deleteStudent(String(id))
            alert('Alumno eliminado correctamente')
            fetchData()
            setStudents((prevStudents: any[]) =>
                prevStudents.filter(student => student.id !== id),
            )
        } catch (error) {
            console.error('Error al eliminar el alumno:', error)
            alert('No se pudo eliminar el alumno')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Filtrar estudiantes según la búsqueda
    const filteredStudents = students?.filter(
        (student: any) =>
            student.name?.toLowerCase().includes(search.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            student.email?.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Alumnos</h1>
            </div>

            <div className="flex items-center gap-4">
                <Input
                    placeholder="Buscar alumno..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Tabla de Alumnos */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lista de Alumnos</CardTitle>
                    <Button onClick={openCreateStudentModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Alumno
                    </Button>
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
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents?.map((student: any) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/admin/students/${student.id}`}
                                                className="font-medium hover:underline">
                                                {student.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {student.last_name}
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.phone}</TableCell>
                                        <TableCell>{student.dni}</TableCell>
                                        <TableCell>{student.branch.name}</TableCell>
                                        <TableCell>{student.status}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        open(student.id)
                                                    }>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteStudent(
                                                            student.id,
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

            {/* Modal para agregar alumno */}
            <Dialog
                open={createStudentModalIsOpen}
                onOpenChange={setCreateStudentModalIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Alumno</DialogTitle>
                    </DialogHeader>
                    <form
                        id="createStudentForm"
                        onSubmit={handleCreateStudentForm}
                        className="space-y-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Apellido"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Teléfono"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input id="dni" name="dni" placeholder="DNI" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select name="branch_id" id="branch_id">
                                    <option value="">Seleccionar...</option>
                                    {branches?.map((branch: any) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <select name="status" id="status">
                                    <option value="">Seleccionar...</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeCreateStudentModal}>
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal para editar alumno */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Alumno</DialogTitle>
                    </DialogHeader>
                    <form
                        id="updateStudentForm"
                        onSubmit={handleUpdateStudentForm}
                        className="space-y-4">
                        <input
                            type="hidden"
                            name="id"
                            value={selectedStudent?.id}
                        />
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Nombre"
                                    defaultValue={selectedStudent?.name}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Apellido"
                                    defaultValue={selectedStudent?.last_name}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    defaultValue={selectedStudent?.email}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    placeholder="Teléfono"
                                    defaultValue={selectedStudent?.phone}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dni">DNI</Label>
                                <Input
                                    id="dni"
                                    name="dni"
                                    placeholder="DNI"
                                    defaultValue={selectedStudent?.dni}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select name="branch_id" id="branch_id" defaultValue={selectedStudent?.branch.id}>
                                    <option value="">Seleccionar...</option>
                                    {branches?.map((branch: any) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <select name="status" id="status" defaultValue={selectedStudent?.status}>
                                    <option value="">Seleccionar...</option>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={close}>
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
