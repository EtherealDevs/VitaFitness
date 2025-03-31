'use client'

import type React from 'react'

import { useState } from 'react'
import { Building, MapPin } from 'lucide-react'

import Button from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import Input from '@/components/ui/Input'
import Label from '@/components/ui/Label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useBranches } from '@/hooks/branches'
import { useRouter } from 'next/navigation'

export default function CreateBranchPage() {
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const { createBranch } = useBranches()
    const router = useRouter()

    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // Simulate API call
            const formData = new FormData()
            formData.append('name', name)
            formData.append('address', address)
            const res = await createBranch(formData)
            console.log(res)

            toast({
                title: 'Sucursal creada',
                description: 'La sucursal ha sido creada exitosamente',
                variant: 'success',
            })

            // Reset form or redirect
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
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <Building className="mr-2 h-6 w-6 text-primary" />
                    Crear Nueva Sucursal
                </h1>

                <Card className="bg-white rounded shadow-md dark:bg-zinc-950 dark:text-white">
                    <CardHeader>
                        <CardTitle className="dark:text-white">
                            Información de la Sucursal
                        </CardTitle>
                        <CardDescription>
                            Ingresa los datos para registrar una nueva sucursal
                            en el sistema.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Required Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground dark:text-white">
                                    Información Básica
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center">
                                            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                                            Nombre de la Sucursal{' '}
                                            <span className="text-destructive ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            className=" p-2 border rounded-lg dark:bg-transparent"
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={name}
                                            onChange={e =>
                                                setName(e.target.value)
                                            }
                                            placeholder="Ej: Sucursal Centro"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="address"
                                            className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                            Dirección{' '}
                                            <span className="text-destructive ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Textarea
                                            id="address"
                                            value={address}
                                            onChange={e =>
                                                setAddress(e.target.value)
                                            }
                                            placeholder="Dirección completa de la sucursal"
                                            className="min-h-[80px]"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button
                                className="bg-transparent text-red-400 border border-red-400 hover:bg-red-400 hover:text-white"
                                type="button"
                                onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button
                                className="bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                                type="submit"
                                disabled={isLoading}>
                                {isLoading ? 'Creando...' : 'Crear Sucursal'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
