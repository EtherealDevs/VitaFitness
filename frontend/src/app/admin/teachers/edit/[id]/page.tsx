'use client'
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
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import {
    Mail,
    Phone,
    User,
    AlertCircle,
    Newspaper,
    Save,
    X,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
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
    const router = useRouter()
    const [teacher, setTeacher] = useState<Teacher | null>(null)
    const [originalTeacher, setOriginalTeacher] = useState<Teacher | null>(null)

    // Estados para los valores del formulario
    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        dni: '',
        email: '',
        phone: '',
    })

    // Estados para loading y errores
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

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

                // Inicializar los valores del formulario
                const initialData = {
                    name: response.teacher.name || '',
                    last_name: response.teacher.last_name || '',
                    dni: response.teacher.dni || '',
                    email: response.teacher.email || '',
                    phone: response.teacher.phone || '',
                }
                setFormData(initialData)
            } catch (error) {
                console.error('Error fetching teacher:', error)
                setError('Error al cargar los datos del profesor')
            }
        }

        fetchData()
    }, [id, getTeacher, getTeacherSchedules])

    // Detectar cambios en el formulario
    useEffect(() => {
        if (originalTeacher) {
            const originalData = {
                name: originalTeacher.name || '',
                last_name: originalTeacher.last_name || '',
                dni: originalTeacher.dni || '',
                email: originalTeacher.email || '',
                phone: originalTeacher.phone || '',
            }

            const hasChanged = Object.keys(formData).some(
                key =>
                    formData[key as keyof typeof formData] !==
                    originalData[key as keyof typeof originalData],
            )

            setHasChanges(hasChanged)
        }
    }, [formData, originalTeacher])

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
            // Enfoque simplificado: enviar solo los datos del formulario
            const formDataToSend = new FormData()

            // Agregar todos los campos del formulario
            formDataToSend.append('name', formData.name)
            formDataToSend.append('last_name', formData.last_name)

            // Solo agregar DNI si tiene valor
            if (formData.dni) {
                formDataToSend.append('dni', formData.dni)
            }

            // Solo agregar email si tiene valor
            if (formData.email) {
                formDataToSend.append('email', formData.email)
            }

            // Solo agregar phone si tiene valor
            if (formData.phone) {
                formDataToSend.append('phone', formData.phone)
            }

            console.log(
                'Enviando datos del profesor:',
                Object.fromEntries(formDataToSend),
            )

            await updateTeacher(id, formDataToSend)

            // Actualizar el estado local
            setTeacher(prev => (prev ? { ...prev, ...formData } : null))
            setOriginalTeacher(prev => (prev ? { ...prev, ...formData } : null))
            setHasChanges(false)

            console.log('Profesor actualizado correctamente')
        } catch (error) {
            console.error('Error completo al actualizar profesor:', error)

            if (error instanceof AxiosError) {
                console.log('Error response data:', error.response?.data)
                console.log('Error response status:', error.response?.status)

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
                    setError('Profesor no encontrado')
                } else if (error.response?.status === 500) {
                    setError(
                        'Error interno del servidor. Por favor, contacta al administrador.',
                    )
                    console.error('Error 500 detalles:', error.response?.data)
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
        if (originalTeacher) {
            const originalData = {
                name: originalTeacher.name || '',
                last_name: originalTeacher.last_name || '',
                dni: originalTeacher.dni || '',
                email: originalTeacher.email || '',
                phone: originalTeacher.phone || '',
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
        router.back()
    }

    if (!teacher) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
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
                            Editar Profesor
                        </h1>
                        <Button
                            variant="outline"
                            onClick={handleGoBack}
                            className="dark:text-white dark:border-gray-600">
                            <X className="mr-2 h-4 w-4" />
                            Cerrar
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {teacher.name} {teacher.last_name}
                    </p>
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
                            Información de Contacto
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
