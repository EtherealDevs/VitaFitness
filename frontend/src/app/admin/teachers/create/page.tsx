'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, CreditCard, Save, X } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/app/admin/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/app/admin/components/ui/card'
import { Input } from '@/app/admin/components/ui/input'
import { Label } from '@/app/admin/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { useTeachers } from '@/hooks/teachers'

export default function CreateTeacherPage() {
    const router = useRouter()
    const { createTeacher } = useTeachers()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
    })

    const handleChange = (field: string, value: string) => {
        let processedValue = value

        // Capitalizar primera letra para nombre y apellido
        if (field === 'name' || field === 'last_name') {
            processedValue =
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
        }
        setFormData(prev => ({ ...prev, [field]: processedValue }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('last_name', formData.last_name)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('phone', formData.phone)
            formDataToSend.append('dni', formData.dni)

            await createTeacher(formDataToSend)

            toast({
                title: 'Profesor creado',
                description: 'El profesor ha sido creado exitosamente',
                variant: 'default',
            })

            router.push('/admin/teachers')
        } catch (error) {
            console.error('Error al crear el profesor:', error)
            toast({
                title: 'Error',
                description: 'Error al crear el profesor',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full p-4  dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="outline"
                            onClick={() => router.back()}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Nuevo Profesor
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Complete la información para crear un nuevo
                                profesor
                            </p>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="text-sm text-slate-500 dark:text-slate-400">
                        <Link
                            href="/admin"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Admin
                        </Link>
                        {' > '}
                        <Link
                            href="/admin/teachers"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Profesores
                        </Link>
                        {' > '}
                        <span className="text-slate-900 dark:text-white">
                            Nuevo Profesor
                        </span>
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Información del Profesor
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Datos Personales
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            htmlFor="name"
                                            className="text-slate-700 dark:text-slate-300 font-medium">
                                            Nombre
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={e =>
                                                handleChange(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nombre del profesor"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="last_name"
                                            className="text-slate-700 dark:text-slate-300 font-medium">
                                            Apellido
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="last_name"
                                            type="text"
                                            value={formData.last_name}
                                            onChange={e =>
                                                handleChange(
                                                    'last_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Apellido del profesor"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label
                                        htmlFor="email"
                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        <Mail className="h-4 w-4" />
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e =>
                                            handleChange(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="email@ejemplo.com"
                                        className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label
                                            htmlFor="phone"
                                            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <Phone className="h-4 w-4" />
                                            Teléfono
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e =>
                                                handleChange(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="+54 9 11 1234-5678"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="dni"
                                            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <CreditCard className="h-4 w-4" />
                                            DNI
                                            <span className="text-red-500 ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="dni"
                                            type="text"
                                            value={formData.dni}
                                            onChange={e =>
                                                handleChange(
                                                    'dni',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="12345678"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isLoading}
                                    className="bg-white/80 dark:bg-slate-800/80 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                                    <X className="mr-2 h-4 w-4" />
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg min-w-[140px]">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Guardando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Crear Profesor
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    )
}
