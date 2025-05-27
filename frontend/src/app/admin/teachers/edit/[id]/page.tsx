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
import { Mail, Phone, Edit2, User, AlertCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { AxiosError } from 'axios'

export default function TeacherProfile() {
    interface Teacher {
        id: number
        name: string
        last_name: string
        email: string
        phone: string
        dni?: string
        [key: string]: string | number | undefined
    }

    interface ValidationError {
        errors: Record<string, string[]>
        message?: string
    }

    const { id } = useParams() as { id: string }
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [originalTeacher, setOriginalTeacher] = useState<Teacher | null>(null)
    const [isEditingEmail, setIsEditingEmail] = useState(false)
    const [isEditingPhone, setIsEditingPhone] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [isEditingLastName, setIsEditingLastName] = useState(false)

    // Estados para los valores de edición
    const [editName, setEditName] = useState('')
    const [editLastName, setEditLastName] = useState('')
    const [editEmail, setEditEmail] = useState('')
    const [editPhone, setEditPhone] = useState('')

    // Estados para loading y errores
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { getTeacher, updateTeacher } = useTeachers()
    const { getTeacherSchedules } = useTeacherSchedules()

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                const response = await getTeacher(id)
                console.log('Teacher data received:', response.teacher)

                setTeacher(response.teacher)
                setOriginalTeacher(response.teacher)

                // Inicializar los valores de edición
                setEditName(response.teacher.name || '')
                setEditLastName(response.teacher.last_name || '')
                setEditEmail(response.teacher.email || '')
                setEditPhone(response.teacher.phone || '')
            } catch (error) {
                console.error('Error fetching teacher:', error)
                setError('Error al cargar los datos del profesor')
            }
        }

        fetchData()
    }, [id, getTeacher, getTeacherSchedules])

    const handleUpdateField = async (field: string, value: string) => {
        // Validar que realmente hay un cambio antes de proceder
        const currentValue = teacher?.[field as keyof Teacher]?.toString() || ''
        if (value === currentValue) {
            // Si no hay cambios, solo cerrar el modo de edición
            switch (field) {
                case 'name':
                    setIsEditingName(false)
                    break
                case 'last_name':
                    setIsEditingLastName(false)
                    break
                case 'email':
                    setIsEditingEmail(false)
                    break
                case 'phone':
                    setIsEditingPhone(false)
                    break
            }
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Crear objeto con solo los campos que necesitamos enviar
            const dataToSend: Record<string, string | number> = {}

            // Agregar todos los campos básicos del profesor
            if (originalTeacher?.name) dataToSend.name = originalTeacher.name
            if (originalTeacher?.last_name)
                dataToSend.last_name = originalTeacher.last_name
            if (originalTeacher?.email) dataToSend.email = originalTeacher.email
            if (originalTeacher?.phone) dataToSend.phone = originalTeacher.phone
            if (originalTeacher?.dni) dataToSend.dni = originalTeacher.dni

            // Sobrescribir el campo que se está actualizando
            dataToSend[field] = value

            console.log('Original teacher data:', originalTeacher)
            console.log('Field being updated:', field, 'New value:', value)
            console.log('Complete data being sent:', dataToSend)

            // Crear FormData con los campos necesarios
            const formData = new FormData()
            Object.entries(dataToSend).forEach(([key, val]) => {
                if (val !== null && val !== undefined) {
                    formData.append(key, val.toString())
                }
            })

            // Log para debug
            console.log('FormData contents:')
            for (const [key, value] of formData.entries()) {
                console.log(key, value)
            }

            await updateTeacher(id, formData)

            // Actualizar el estado local solo si la actualización fue exitosa
            setTeacher(prev => (prev ? { ...prev, [field]: value } : null))

            // También actualizar los datos originales
            setOriginalTeacher(prev =>
                prev ? { ...prev, [field]: value } : null,
            )

            // Resetear estados de edición
            switch (field) {
                case 'name':
                    setIsEditingName(false)
                    break
                case 'last_name':
                    setIsEditingLastName(false)
                    break
                case 'email':
                    setIsEditingEmail(false)
                    break
                case 'phone':
                    setIsEditingPhone(false)
                    break
            }

            console.log('Update successful for field:', field)
        } catch (error) {
            console.error(`Error updating teacher ${field}:`, error)

            // Log detallado del error
            if (error instanceof AxiosError) {
                console.log('Error response:', error.response?.data)
                console.log('Error status:', error.response?.status)
                console.log('Error headers:', error.response?.headers)

                if (error.response?.status === 422) {
                    const errorData = error.response.data as ValidationError
                    console.log('Validation errors:', errorData)

                    if (errorData.errors) {
                        const errorMessages = Object.values(
                            errorData.errors,
                        ).flat()
                        setError(
                            `Error de validación: ${errorMessages.join(', ')}`,
                        )
                    } else if (errorData.message) {
                        setError(`Error de validación: ${errorData.message}`)
                    } else {
                        setError(
                            'Error de validación: Los datos enviados no son válidos',
                        )
                    }
                } else if (error.response?.status === 404) {
                    setError('Profesor no encontrado')
                } else if (error.response?.status === 500) {
                    setError('Error interno del servidor')
                } else {
                    setError(`Error al actualizar ${field}: ${error.message}`)
                }
            } else if (error instanceof Error) {
                setError(`Error al actualizar ${field}: ${error.message}`)
            } else {
                setError(`Error desconocido al actualizar ${field}`)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleStartEdit = (field: string) => {
        setError(null)
        switch (field) {
            case 'name':
                setIsEditingName(true)
                break
            case 'last_name':
                setIsEditingLastName(true)
                break
            case 'email':
                setIsEditingEmail(true)
                break
            case 'phone':
                setIsEditingPhone(true)
                break
        }
    }

    const handleUpdateName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedName = editName.trim()

        if (trimmedName === '') {
            setError('El nombre no puede estar vacío')
            return
        }

        if (trimmedName.length < 2) {
            setError('El nombre debe tener al menos 2 caracteres')
            return
        }

        await handleUpdateField('name', trimmedName)
    }

    const handleUpdateLastName = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault()
        const trimmedLastName = editLastName.trim()

        if (trimmedLastName === '') {
            setError('El apellido no puede estar vacío')
            return
        }

        if (trimmedLastName.length < 2) {
            setError('El apellido debe tener al menos 2 caracteres')
            return
        }

        await handleUpdateField('last_name', trimmedLastName)
    }

    const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedEmail = editEmail.trim()

        if (trimmedEmail === '') {
            setError('El email no puede estar vacío')
            return
        }

        // Validación básica de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(trimmedEmail)) {
            setError('Por favor ingresa un email válido')
            return
        }

        await handleUpdateField('email', trimmedEmail)
    }

    const handleUpdatePhone = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const trimmedPhone = editPhone.trim()

        if (trimmedPhone === '') {
            setError('El teléfono no puede estar vacío')
            return
        }

        // Validación básica de teléfono (solo números, espacios, guiones y paréntesis)
        const phoneRegex = /^[\d\s\-()+]+$/
        if (!phoneRegex.test(trimmedPhone)) {
            setError(
                'El teléfono solo puede contener números, espacios, guiones y paréntesis',
            )
            return
        }

        await handleUpdateField('phone', trimmedPhone)
    }

    const handleCancelEdit = (field: string) => {
        setError(null)
        switch (field) {
            case 'name':
                setEditName(teacher?.name || '')
                setIsEditingName(false)
                break
            case 'last_name':
                setEditLastName(teacher?.last_name || '')
                setIsEditingLastName(false)
                break
            case 'email':
                setEditEmail(teacher?.email || '')
                setIsEditingEmail(false)
                break
            case 'phone':
                setEditPhone(teacher?.phone || '')
                setIsEditingPhone(false)
                break
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
                    {teacher.dni && (
                        <p className="text-sm text-gray-500">
                            DNI: {teacher.dni}
                        </p>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setError(null)}
                        className="ml-auto">
                        ×
                    </Button>
                </div>
            )}

            {/* Contact Info */}
            <div className=" gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Name and Last Name - Side by side */}
                        <div className="flex items-start space-x-4">
                            <User className="h-4 w-4 text-muted-foreground mt-8" />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div>
                                    <Label>Nombre</Label>
                                    <form onSubmit={handleUpdateName}>
                                        <div className="flex items-center gap-2">
                                            {isEditingName ? (
                                                <>
                                                    <Input
                                                        value={editName}
                                                        onChange={e =>
                                                            setEditName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        autoFocus
                                                        disabled={isLoading}
                                                        placeholder="Ingresa el nombre"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={
                                                            isLoading ||
                                                            editName.trim() ===
                                                                ''
                                                        }>
                                                        {isLoading
                                                            ? '...'
                                                            : 'Guardar'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleCancelEdit(
                                                                'name',
                                                            )
                                                        }
                                                        disabled={isLoading}>
                                                        Cancelar
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Input
                                                        value={
                                                            teacher.name || ''
                                                        }
                                                        readOnly
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleStartEdit(
                                                                'name',
                                                            )
                                                        }
                                                        disabled={isLoading}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Apellido */}
                                <div>
                                    <Label>Apellido</Label>
                                    <form onSubmit={handleUpdateLastName}>
                                        <div className="flex items-center gap-2">
                                            {isEditingLastName ? (
                                                <>
                                                    <Input
                                                        value={editLastName}
                                                        onChange={e =>
                                                            setEditLastName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        autoFocus
                                                        disabled={isLoading}
                                                        placeholder="Ingresa el apellido"
                                                    />
                                                    <Button
                                                        type="submit"
                                                        size="sm"
                                                        disabled={
                                                            isLoading ||
                                                            editLastName.trim() ===
                                                                ''
                                                        }>
                                                        {isLoading
                                                            ? '...'
                                                            : 'Guardar'}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleCancelEdit(
                                                                'last_name',
                                                            )
                                                        }
                                                        disabled={isLoading}>
                                                        Cancelar
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Input
                                                        value={
                                                            teacher.last_name ||
                                                            ''
                                                        }
                                                        readOnly
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleStartEdit(
                                                                'last_name',
                                                            )
                                                        }
                                                        disabled={isLoading}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Email Form */}
                        <div className="flex items-center space-x-4">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <Label>Correo elect.</Label>
                                <form onSubmit={handleUpdateEmail}>
                                    <div className="flex items-center gap-2">
                                        {isEditingEmail ? (
                                            <>
                                                <Input
                                                    value={editEmail}
                                                    onChange={e =>
                                                        setEditEmail(
                                                            e.target.value,
                                                        )
                                                    }
                                                    autoFocus
                                                    type="email"
                                                    disabled={isLoading}
                                                    placeholder="ejemplo@correo.com"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={
                                                        isLoading ||
                                                        editEmail.trim() === ''
                                                    }>
                                                    {isLoading
                                                        ? '...'
                                                        : 'Guardar'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleCancelEdit(
                                                            'email',
                                                        )
                                                    }
                                                    disabled={isLoading}>
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Input
                                                    value={teacher.email || ''}
                                                    readOnly
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleStartEdit('email')
                                                    }
                                                    disabled={isLoading}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Phone Form */}
                        <div className="flex items-center space-x-4">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                                <Label>Teléfono</Label>
                                <form onSubmit={handleUpdatePhone}>
                                    <div className="flex items-center gap-2">
                                        {isEditingPhone ? (
                                            <>
                                                <Input
                                                    value={editPhone}
                                                    onChange={e =>
                                                        setEditPhone(
                                                            e.target.value,
                                                        )
                                                    }
                                                    autoFocus
                                                    disabled={isLoading}
                                                    placeholder="Ej: +54 11 1234-5678"
                                                />
                                                <Button
                                                    type="submit"
                                                    size="sm"
                                                    disabled={
                                                        isLoading ||
                                                        editPhone.trim() === ''
                                                    }>
                                                    {isLoading
                                                        ? '...'
                                                        : 'Guardar'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleCancelEdit(
                                                            'phone',
                                                        )
                                                    }
                                                    disabled={isLoading}>
                                                    Cancelar
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Input
                                                    value={teacher.phone || ''}
                                                    readOnly
                                                />
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleStartEdit('phone')
                                                    }
                                                    disabled={isLoading}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
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
