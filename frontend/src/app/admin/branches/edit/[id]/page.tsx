'use client'

import type React from 'react'
import { useEffect, useState, useCallback } from 'react'
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
import { useParams, useRouter } from 'next/navigation'
import { useStudents } from '@/hooks/students'

export default function EditBranchPage() {
    const { updateBranch } = useBranches()
    const router = useRouter()
    const { id } = useParams()
    const { getStudents } = useStudents()

    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // ✅ Memoizamos la función para evitar que cambie en cada render
    const fetchStudents = useCallback(async () => {
        try {
            await getStudents()
        } catch (error) {
            console.error(error)
        }
    }, [getStudents])

    // ✅ Ejecutamos la función una sola vez al montar el componente
    useEffect(() => {
        fetchStudents()
    }, [fetchStudents])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('address', address)

            const res = await updateBranch(id as string, formData)
            console.log(res)

            toast({
                title: 'Sucursal editada',
                description: 'La sucursal ha sido actualizada exitosamente',
                variant: 'success',
            })

            router.push('/admin/branches')
        } catch (error) {
            console.error('Error updating branch:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al editar la sucursal',
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
                    Editar Sucursal
                </h1>

                <Card className="bg-white rounded shadow-md">
                    <CardHeader>
                        <CardTitle>Información de la Sucursal</CardTitle>
                        <CardDescription>
                            Ingresa los datos para registrar una nueva sucursal
                            en el sistema.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground ">
                                    Información Básica
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="name"
                                            className="flex items-center">
                                            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                                            Nombre de la Sucursal
                                            <span className="text-destructive ml-1">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            className="p-2 border rounded-lg dark:border-gray-400 dark:bg-gray-300"
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
                                            Dirección
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
                                {isLoading ? 'Editando...' : 'Editar Sucursal'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
