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

// import { useBranches } from '@/hooks/branches'

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([])
    // const [branches, setBranches] = useState<Branch[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [createStudentModalIsOpen, setCreateStudentModalIsOpen] =
        useState(false)
    const [selectedStudent, setSelectedStudent] = useState<
        Student | undefined
    >()
    const [search, setSearch] = useState('')

    const { getStudents, createStudent, updateStudent, deleteStudent } =
        useStudents()
    // const { getBranches } = useBranches()
    const [showDetails, setShowDetails] = useState(false)

    function open(id: number) {
        setIsOpen(true)
        setSelectedStudent(students.find(student => student.id === id))
    }
    const toggleDetails = () => {
        setShowDetails(!showDetails)
    }

    // interface Branch {
    //     id: number
    //     name: string
    // }

    interface Student {
        id: number
        name: string
        last_name: string
        email: string
        phone: string
        dni: string
        status: string
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
        // try {
        //     const response = await getBranches()
        //     setBranches(response.branches)
        // } catch (error) {
        //     console.error(error)
        //     throw error
        // }
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
        await updateStudent(formData.get('id') as string, formData)
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
            setStudents((prevStudents: Student[]) =>
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
        (student: Student) =>
            student.name?.toLowerCase().includes(search.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(search.toLowerCase()) ||
            student.email?.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <div className="space-y-6 p-6 max-w-full">
            <div className="flex flex-wrap items-center justify-between">
                <h1 className="text-2xl md:text-3xl font-bold">Alumnos</h1>
                <div className="flex sm:hidden justify-center mt-2">
                    <Button
                        onClick={toggleDetails}
                        variant="outline"
                        className="w-full sm:w-auto">
                        Mostrar más detalles
                    </Button>
                </div>
                <div className="hidden sm:flex justify-end gap-2">
                    <Button onClick={openCreateStudentModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Alumno
                    </Button>
                </div>
            </div>

            {/* Barra de Busqueda */}
            <div className="flex  sm:justify-start w-full">
                <input
                    type="text"
                    placeholder="Buscar alumno..."
                    className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl px-4 py-2 border rounded-md text-sm md:text-base"
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Tabla de Alumnos */}
            <Card className="w-full">
                <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-2">
                    <CardTitle>Lista de Alumnos</CardTitle>
                    <Button onClick={openCreateStudentModal}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Alumno
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-scroll max-w-full">
                        <Table className="min-w-full overflow-scroll">
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className={`sm:table-cell ${
                                            showDetails
                                                ? 'table-cell'
                                                : 'hidden'
                                        }`}>
                                        ID
                                    </TableHead>
                                    <TableHead>DNI</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Apellido</TableHead>
                                    <TableHead
                                        className={`sm:table-cell ${
                                            showDetails
                                                ? 'table-cell'
                                                : 'hidden'
                                        }`}>
                                        Teléfono
                                    </TableHead>
                                    <TableHead
                                        className={`sm:table-cell ${
                                            showDetails
                                                ? 'table-cell'
                                                : 'hidden'
                                        }`}>
                                        Email
                                    </TableHead>
                                    <TableHead
                                        className={`sm:table-cell ${
                                            showDetails
                                                ? 'table-cell'
                                                : 'hidden'
                                        }`}>
                                        Sucursal
                                    </TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">
                                        Acciones
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents?.map((student: Student) => (
                                    <TableRow key={student.id}>
                                        <TableCell>{student.id}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {student.dni}
                                        </TableCell>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>
                                            {student.last_name}
                                        </TableCell>
                                        <TableCell>{student.email}</TableCell>
                                        <TableCell>{student.phone}</TableCell>
                                        {/* <TableCell
                                            className={`sm:table-cell ${
                                                showDetails
                                                    ? 'table-cell'
                                                    : 'hidden'
                                            }`}>
                                            {student.branch.name}
                                        </TableCell> */}
                                        <TableCell
                                            className={`sm:table-cell ${
                                                showDetails
                                                    ? 'table-cell'
                                                    : 'hidden'
                                            }`}>
                                            {student.status}
                                        </TableCell>
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
                    {/* Botón visible solo en pantallas pequeñas */}
                    <div className="sm:hidden flex justify-center mt-2">
                        <Button variant="outline" onClick={toggleDetails}>
                            {showDetails
                                ? 'Ocultar detalles'
                                : 'Mostrar más detalles'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modal para agregar alumno */}
            <Dialog
                open={createStudentModalIsOpen}
                onOpenChange={setCreateStudentModalIsOpen}>
                <DialogContent className="w-full max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar Alumno</DialogTitle>
                    </DialogHeader>
                    <form
                        id="createStudentForm"
                        onSubmit={handleCreateStudentForm}
                        className="space-y-4">
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
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
                            {/* <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select name="branch_id" id="branch_id">
                                    <option value="">Seleccionar...</option>
                                    {branches?.map((branch: Branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
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
                <DialogContent className="w-full sm:max-w-[425px]">
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
                            {/* <div className="grid gap-2">
                                <Label htmlFor="branch_id">Sucursal</Label>
                                <select
                                    name="branch_id"
                                    id="branch_id"
                                    defaultValue={selectedStudent?.branch.id}>
                                    <option value="">Seleccionar...</option>
                                    {branches?.map((branch: Branch) => (
                                        <option
                                            key={branch.id}
                                            value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">Estado</Label>
                                <select
                                    name="status"
                                    id="status"
                                    defaultValue={selectedStudent?.status}>
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
