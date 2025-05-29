'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useStudents } from '@/hooks/students'
import { AxiosError } from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { Button } from '@/app/admin/components/ui/button'
import {
    Mail,
    Phone,
    User,
    AlertCircle,
    Newspaper,
    Save,
    X,
    UserCheck,
} from 'lucide-react'

interface Student {
    id?: number
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    status: string
}

interface ValidationError {
    errors: Record<string, string[]>
    message?: string
}

export default function EditStudentPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params as { id: string }

    const { getStudent, updateStudent } = useStudents()

    const [student, setStudent] = useState<Student | null>(null)
    const [originalStudent, setOriginalStudent] = useState<Student | null>(null)

    // Estados para los valores del formulario
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
        status: 'pendiente',
    })

    // Estados para loading y errores
    const [isLoading, setIsLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    const fetchStudent = useCallback(async () => {
        try {
            setError(null)
            const response = await getStudent(id)
            console.log('Student data received:', response.student)

            setStudent(response.student)
            setOriginalStudent(response.student)

            // Inicializar los valores del formulario
            const initialData = {
                name: response.student.name || '',
                last_name: response.student.last_name || '',
                email: response.student.email || '',
                phone: response.student.phone || '',
                dni: response.student.dni || '',
                status: response.student.status || 'pendiente',
            }
            setFormData(initialData)
        } catch (error) {
            console.error('Error fetching student:', error)
            setError('Error al cargar los datos del estudiante')
        } finally {
            setFetchLoading(false)
        }
    }, [getStudent, id])

    useEffect(() => {
        fetchStudent()
    }, [fetchStudent])

    // Detectar cambios en el formulario
    useEffect(() => {
        if (originalStudent) {
            const originalData = {
                name: originalStudent.name || '',
                last_name: originalStudent.last_name || '',
                email: originalStudent.email || '',
                phone: originalStudent.phone || '',
                dni: originalStudent.dni || '',
                status: originalStudent.status || 'pendiente',
            }

            const hasChanged = Object.keys(formData).some(
                key =>
                    formData[key as keyof typeof formData] !==
                    originalData[key as keyof typeof originalData],
            )

            setHasChanges(hasChanged)
        }
    }, [formData, originalStudent])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }))
        setError(null) // Limpiar errores al escribir
    }

    const validateForm = () => {
        const errors: string[] = []

        if (!formData.name.trim()) {
            errors.push('El nombre es requerido')
        } else if (formData.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres')
        }

        if (!formData.last_name.trim()) {
            errors.push('El apellido es requerido')
        } else if (formData.last_name.trim().length < 2) {
            errors.push('El apellido debe tener al menos 2 caracteres')
        }

        // Email es opcional, pero si se proporciona debe ser válido
        if (formData.email.trim() && formData.email.trim() !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(formData.email)) {
                errors.push('Por favor ingresa un email válido')
            }
        }

        // Teléfono es opcional, pero si se proporciona debe ser válido
        if (formData.phone.trim() && formData.phone.trim() !== '') {
            const phoneRegex = /^[\d\s\-()+]+$/
            if (!phoneRegex.test(formData.phone)) {
                errors.push(
                    'El teléfono solo puede contener números, espacios, guiones y paréntesis',
                )
            }
        }

        // DNI validaciones específicas
        if (formData.dni.trim() && formData.dni.trim() !== '') {
            const dniRegex = /^\d+$/
            if (!dniRegex.test(formData.dni)) {
                errors.push('El DNI solo puede contener números')
            } else if (formData.dni.length < 6) {
                errors.push('El DNI debe tener al menos 6 números')
            } else if (formData.dni.length > 10) {
                errors.push('El DNI no puede tener más de 10 números')
            }
        }

        return errors
    }

    const handleDniChange = (value: string) => {
        // Solo permitir números
        const numericValue = value.replace(/\D/g, '')
        // Limitar a 10 caracteres máximo
        const limitedValue = numericValue.slice(0, 10)
        handleInputChange('dni', limitedValue)
    }

    const handleSave = async () => {
        const validationErrors = validateForm()
        if (validationErrors.length > 0) {
            setError(validationErrors.join(', '))
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Crear FormData con los campos necesarios
            const formDataToSend = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value.toString())
                }
            })

            console.log('Saving student data:', formData)

            await updateStudent(id, formDataToSend)

            // Actualizar el estado local
            setStudent(prev => (prev ? { ...prev, ...formData } : null))
            setOriginalStudent(prev => (prev ? { ...prev, ...formData } : null))
            setHasChanges(false)

            console.log('Student updated successfully')

            // Redirigir después de un breve delay para mostrar el éxito
            setTimeout(() => {
                router.push('/admin/students')
            }, 1000)
        } catch (error) {
            console.error('Error updating student:', error)

            if (error instanceof AxiosError) {
                if (error.response?.status === 422) {
                    const errorData = error.response.data as ValidationError
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
                    setError('Estudiante no encontrado')
                } else if (error.response?.status === 500) {
                    setError('Error interno del servidor')
                } else {
                    setError(`Error al actualizar: ${error.message}`)
                }
            } else if (error instanceof Error) {
                setError(`Error al actualizar: ${error.message}`)
            } else {
                setError('Error desconocido al actualizar')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        if (originalStudent) {
            const originalData = {
                name: originalStudent.name || '',
                last_name: originalStudent.last_name || '',
                email: originalStudent.email || '',
                phone: originalStudent.phone || '',
                dni: originalStudent.dni || '',
                status: originalStudent.status || 'pendiente',
            }
            setFormData(originalData)
            setHasChanges(false)
            setError(null)
        }
    }

    const handleGoBack = () => {
        if (hasChanges) {
            const confirmLeave = confirm(
                'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
            )
            if (!confirmLeave) return
        }
        router.push('/admin/students')
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'activo':
                return 'text-green-600 dark:text-green-400'
            case 'inactivo':
                return 'text-red-600 dark:text-red-400'
            case 'pendiente':
                return 'text-yellow-600 dark:text-yellow-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'activo':
                return 'Activo'
            case 'inactivo':
                return 'Inactivo'
            case 'pendiente':
                return 'Pendiente'
            default:
                return status
        }
    }

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Estudiante no encontrado
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        No se pudo cargar la información del estudiante
                    </p>
                    <Button
                        onClick={() => router.push('/admin/students')}
                        variant="outline">
                        Volver a la lista
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen w-full p-4">
            <div className="w-full max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Editar Estudiante
                        </h1>
                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            className="dark:text-white dark:border-gray-600">
                            <X className="mr-2 h-4 w-4" />
                            Cerrar
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {student.name} {student.last_name}
                        </p>
                        <span
                            className={`text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 ${getStatusColor(
                                student.status,
                            )}`}>
                            {getStatusLabel(student.status)}
                        </span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2 text-red-700">
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

                {/* Form Card */}
                <Card className="bg-white/80 dark:bg-[#1f2122] backdrop-blur shadow-lg border border-opacity-50 dark:border-gray-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            Información Personal
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Name and Last Name - Side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nombre</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={e =>
                                        handleInputChange(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ingresa el nombre"
                                    disabled={isLoading}
                                    className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <Label htmlFor="last_name">Apellido</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={e =>
                                        handleInputChange(
                                            'last_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ingresa el apellido"
                                    disabled={isLoading}
                                    className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* DNI */}
                        <div>
                            <Label
                                htmlFor="dni"
                                className="flex items-center gap-2">
                                <Newspaper className="h-4 w-4" />
                                DNI
                            </Label>
                            <Input
                                id="dni"
                                value={formData.dni}
                                onChange={e => handleDniChange(e.target.value)}
                                placeholder="Ingresa el DNI (6-10 números)"
                                disabled={isLoading}
                                className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                                maxLength={10}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <Label
                                htmlFor="email"
                                className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Correo electrónico
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={e =>
                                    handleInputChange('email', e.target.value)
                                }
                                placeholder="ejemplo@correo.com (opcional)"
                                disabled={isLoading}
                                className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label
                                htmlFor="phone"
                                className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                Teléfono
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={e =>
                                    handleInputChange('phone', e.target.value)
                                }
                                placeholder="Ej: +54 11 1234-5678 (opcional)"
                                disabled={isLoading}
                                className="dark:bg-[#363a3b] dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <Label
                                htmlFor="status"
                                className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Estado
                            </Label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={e =>
                                    handleInputChange('status', e.target.value)
                                }
                                disabled={isLoading}
                                className="mt-1 block w-full border border-gray-300 dark:border-slate-700 rounded-md shadow-sm p-2 text-sm dark:bg-[#363a3b] dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50">
                                <option value="pendiente">Pendiente</option>
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading || !hasChanges}
                                className="dark:text-white dark:border-gray-600">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={isLoading || !hasChanges}
                                className="bg-purple-600 hover:bg-purple-700 text-white">
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
