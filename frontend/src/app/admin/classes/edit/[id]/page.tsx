'use client'

import type React from 'react'
import { useEffect, useState, useRef } from 'react'
import {
    BookOpen,
    Building,
    Users,
    DollarSign,
    CalendarRange,
    Save,
    ArrowLeft,
} from 'lucide-react'

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { useClasses } from '@/hooks/classes'
import { type Plan, usePlans } from '@/hooks/plans'
import { type Branch, useBranches } from '@/hooks/branches'
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from '@/app/admin/components/ui/skeleton'

export default function EditClassPage() {
    // Acceder directamente a params.id ya que es un objeto simple
    const { id } = useParams()
    const classId = id as string

    const [selectedPlan, setSelectedPlan] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('')
    const [price, setPrice] = useState('')
    const [maxStudents, setMaxStudents] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [plans, setPlans] = useState<Plan[]>([])
    const [branches, setBranches] = useState<Branch[]>([])

    // Obtener las funciones de los hooks
    const { getClass, updateClass } = useClasses()
    const { getPlans } = usePlans()
    const { getBranches } = useBranches()
    const router = useRouter()

    // Bandera para controlar si ya se ha realizado la carga inicial
    const initialLoadDone = useRef(false)

    // Función para cargar los datos iniciales
    useEffect(() => {
        // Prevenir múltiples cargas y bucles infinitos
        if (initialLoadDone.current) return

        // Marcar inmediatamente que estamos en proceso de carga
        initialLoadDone.current = true

        const controller = new AbortController()
        const signal = controller.signal

        async function loadData() {
            try {
                setIsLoading(true)

                // Cargar datos de la clase
                const classData = await getClass(classId)

                // Verificar si la petición fue abortada
                if (signal.aborted) return

                if (classData && classData.class) {
                    setSelectedPlan(classData.class.plan_id.toString())
                    setSelectedBranch(classData.class.branch_id.toString())
                    setPrice(classData.class.precio.toString())
                    setMaxStudents(classData.class.max_students.toString())
                }

                // Cargar planes y sucursales en paralelo
                const [plansData, branchesData] = await Promise.all([
                    getPlans(),
                    getBranches(),
                ])

                // Verificar si la petición fue abortada
                if (signal.aborted) return

                setPlans(plansData.plans)
                setBranches(branchesData.branches)
            } catch (error) {
                if (!signal.aborted) {
                    console.error('Error loading data:', error)
                    toast({
                        title: 'Error',
                        description:
                            'No se pudo cargar la información necesaria',
                        variant: 'destructive',
                    })
                }
            } finally {
                if (!signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        loadData()

        // Función de limpieza para abortar peticiones pendientes
        return () => {
            controller.abort()
        }
    }, [classId, getClass, getPlans, getBranches])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            const formData = new FormData()
            formData.append('plan_id', selectedPlan)
            formData.append('branch_id', selectedBranch)
            formData.append('precio', price)
            formData.append('max_students', maxStudents)

            await updateClass(classId, formData)

            toast({
                title: 'Clase actualizada',
                description: 'La clase ha sido actualizada exitosamente',
                variant: 'success',
            })

            router.push('/admin/classes')
        } catch (error) {
            console.error('Error updating class:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al actualizar la clase',
                variant: 'destructive',
            })
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="container mx-auto py-4 px-4 sm:py-6 md:py-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    Editar Clase
                </h1>

                <Card className="bg-white rounded shadow-md dark:bg-zinc-950 dark:text-white">
                    <CardHeader className="pb-4 sm:pb-6">
                        <CardTitle className="text-lg sm:text-xl dark:text-white">
                            Información de la Clase
                        </CardTitle>
                        <CardDescription>
                            Actualiza los detalles de la clase en el sistema.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4 sm:space-y-6">
                            {/* Plan and Branch Selection */}
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    Plan y Sucursal
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <div className="relative">
                                            <Select
                                                value={selectedPlan}
                                                onValueChange={
                                                    setSelectedPlan
                                                }>
                                                <SelectTrigger
                                                    id="plan"
                                                    className="w-full">
                                                    <SelectValue placeholder="Seleccionar plan" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {plans.map(plan => (
                                                        <SelectItem
                                                            key={plan.id}
                                                            value={plan.id.toString()}>
                                                            {plan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <CalendarRange className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="branch">
                                            Sucursal
                                        </Label>
                                        <div className="relative">
                                            <Select
                                                value={selectedBranch}
                                                onValueChange={
                                                    setSelectedBranch
                                                }>
                                                <SelectTrigger
                                                    id="branch"
                                                    className="w-full">
                                                    <SelectValue placeholder="Seleccionar sucursal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branches.map(
                                                        branch => (
                                                            <SelectItem
                                                                key={
                                                                    branch.id
                                                                }
                                                                value={branch.id.toString()}>
                                                                {
                                                                    branch.name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <Building className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Details */}
                            <div className="space-y-3 sm:space-y-4">
                                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                                    Detalles de la Clase
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 bg-transparent">
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="price">
                                            Precio
                                        </Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="price"
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={price}
                                                onChange={e =>
                                                    setPrice(e.target.value)
                                                }
                                                placeholder="0.00"
                                                className="pl-10 bg-transparent"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="max_students">
                                            Máximo de Estudiantes
                                        </Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="max_students"
                                                id="max_students"
                                                type="number"
                                                min="1"
                                                value={maxStudents}
                                                onChange={e =>
                                                    setMaxStudents(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="20"
                                                className="pl-10 bg-transparent"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 border-t pt-4 sm:pt-6">
                            <Button
                                className="w-full sm:w-auto bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                                type="button"
                                onClick={() => router.back()}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Cancelar
                            </Button>
                            <Button
                                className="w-full sm:w-auto bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                                type="submit"
                                disabled={isSaving}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSaving
                                    ? 'Guardando...'
                                    : 'Guardar Cambios'}
                            </Button>
                        </CardFooter>
                    </form>
                    {/* {isLoading ? (
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-32" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-40" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Skeleton className="h-10 w-full" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    ) : (
                        
                    )} */}
                </Card>
            </div>
        </div>
    )
}
