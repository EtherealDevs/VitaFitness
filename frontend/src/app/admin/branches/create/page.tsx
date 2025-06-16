'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Building, MapPin, Save, X } from 'lucide-react'
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
import { useBranches } from '@/hooks/branches'

export default function CreateBranchPage() {
    const router = useRouter()
    const { createBranch } = useBranches()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        address: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('name', formData.name)
            formDataToSend.append('address', formData.address)

            await createBranch(formDataToSend)

            toast({
                title: 'Sucursal creada',
                description: 'La sucursal ha sido creada exitosamente',
                variant: 'default',
            })

            router.push('/admin/branches')
        } catch (error) {
            console.error('Error creating branch:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al crear la sucursal',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full p-4 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
                                <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Nueva Sucursal
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Complete la información para crear una nueva
                                sucursal
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
                            href="/admin/branches"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Sucursales
                        </Link>
                        {' > '}
                        <span className="text-slate-900 dark:text-white">
                            Nueva Sucursal
                        </span>
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Información de la Sucursal
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div>
                                    <Label
                                        htmlFor="name"
                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        <Building className="h-4 w-4" />
                                        Nombre de la Sucursal
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Ej: Sucursal Centro"
                                        className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600 focus:border-purple-500 dark:focus:border-purple-400"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="address"
                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                        <MapPin className="h-4 w-4" />
                                        Dirección
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Dirección completa de la sucursal"
                                        className="mt-2 min-h-[100px] w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                        required
                                        disabled={isLoading}
                                    />
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
                                            Creando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Crear Sucursal
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
