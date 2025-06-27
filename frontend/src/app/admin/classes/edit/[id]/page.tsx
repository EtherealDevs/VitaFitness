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
    ChevronDown,
    Check,
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
import { toast } from '@/hooks/use-toast'
import { useClasses } from '@/hooks/classes'
import { type Plan, usePlans } from '@/hooks/plans'
import { type Branch, useBranches } from '@/hooks/branches'
import { useParams, useRouter } from 'next/navigation'

export default function EditClassPage() {
    const { id } = useParams()
    const classId = id as string

    const [selectedPlan, setSelectedPlan] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('')
    const [price, setPrice] = useState('')
    const [maxStudents, setMaxStudents] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [plans, setPlans] = useState<Plan[]>([])
    const [branches, setBranches] = useState<Branch[]>([])

    // Estados para controlar los dropdowns
    const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false)
    const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false)

    // Referencias para cerrar dropdowns al hacer click fuera
    const planDropdownRef = useRef<HTMLDivElement>(null)
    const branchDropdownRef = useRef<HTMLDivElement>(null)

    const { getClass, updateClass } = useClasses()
    const { getPlans } = usePlans()
    const { getBranches } = useBranches()
    const router = useRouter()

    // Encontrar el plan y sucursal seleccionados para mostrar sus nombres
    const selectedPlanData = plans.find(
        plan => plan.id.toString() === selectedPlan,
    )
    const selectedBranchData = branches.find(
        branch => branch.id.toString() === selectedBranch,
    )

    // Cerrar dropdowns al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                planDropdownRef.current &&
                !planDropdownRef.current.contains(event.target as Node)
            ) {
                setIsPlanDropdownOpen(false)
            }
            if (
                branchDropdownRef.current &&
                !branchDropdownRef.current.contains(event.target as Node)
            ) {
                setIsBranchDropdownOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        async function loadData() {
            try {
                const classData = await getClass(classId)
                const [plansData, branchesData] = await Promise.all([
                    getPlans(),
                    getBranches(),
                ])

                setPlans(plansData.plans)
                setBranches(branchesData.branches)

                if (classData && classData.classe) {
                    setSelectedPlan(classData.classe.plan.id.toString())
                    setSelectedBranch(classData.classe.branch.id.toString())
                    setPrice(classData.classe.precio.toString())
                    setMaxStudents(classData.classe.max_students.toString())
                }
            } catch (error) {
                console.error('Error loading data:', error)
                toast({
                    title: 'Error',
                    description: 'No se pudo cargar la información necesaria',
                    variant: 'destructive',
                })
            }
        }

        loadData()
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

    const handlePlanSelect = (plan: Plan) => {
        setSelectedPlan(plan.id.toString())
        setIsPlanDropdownOpen(false)
    }

    const handleBranchSelect = (branch: Branch) => {
        setSelectedBranch(branch.id.toString())
        setIsBranchDropdownOpen(false)
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
                                    {/* Plan Dropdown */}
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <div
                                            className="relative"
                                            ref={planDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsPlanDropdownOpen(
                                                        !isPlanDropdownOpen,
                                                    )
                                                }
                                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                                <div className="flex items-center">
                                                    <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="truncate text-left">
                                                        {selectedPlanData?.name ||
                                                            'Seleccionar plan'}
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                                                        isPlanDropdownOpen
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {isPlanDropdownOpen && (
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() =>
                                                        setIsPlanDropdownOpen(
                                                            false,
                                                        )
                                                    }>
                                                    <div
                                                        className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl max-h-60 overflow-auto"
                                                        style={{
                                                            top:
                                                                planDropdownRef.current?.getBoundingClientRect()
                                                                    .bottom ||
                                                                0,
                                                            left:
                                                                planDropdownRef.current?.getBoundingClientRect()
                                                                    .left || 0,
                                                            width:
                                                                planDropdownRef.current?.getBoundingClientRect()
                                                                    .width ||
                                                                'auto',
                                                        }}
                                                        onClick={e =>
                                                            e.stopPropagation()
                                                        }>
                                                        {plans.map(plan => (
                                                            <div
                                                                key={plan.id}
                                                                onClick={() =>
                                                                    handlePlanSelect(
                                                                        plan,
                                                                    )
                                                                }
                                                                className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                                                <div className="flex items-center">
                                                                    <CalendarRange className="mr-3 h-4 w-4 text-gray-500" />
                                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                        {
                                                                            plan.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {selectedPlan ===
                                                                    plan.id.toString() && (
                                                                    <Check className="h-4 w-4 text-blue-600" />
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Branch Dropdown */}
                                    <div className="space-y-1 sm:space-y-2">
                                        <Label htmlFor="branch">Sucursal</Label>
                                        <div
                                            className="relative"
                                            ref={branchDropdownRef}>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setIsBranchDropdownOpen(
                                                        !isBranchDropdownOpen,
                                                    )
                                                }
                                                className="w-full flex items-center justify-between px-3 py-2.5 text-sm bg-white dark:bg-zinc-900 border border-gray-300 dark:border-gray-600 rounded-md hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                                <div className="flex items-center">
                                                    <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                                                    <span className="truncate text-left">
                                                        {selectedBranchData?.name ||
                                                            'Seleccionar sucursal'}
                                                    </span>
                                                </div>
                                                <ChevronDown
                                                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                                                        isBranchDropdownOpen
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                />
                                            </button>

                                            {isBranchDropdownOpen && (
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() =>
                                                        setIsBranchDropdownOpen(
                                                            false,
                                                        )
                                                    }>
                                                    <div
                                                        className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-xl max-h-60 overflow-auto"
                                                        style={{
                                                            top:
                                                                branchDropdownRef.current?.getBoundingClientRect()
                                                                    .bottom ||
                                                                0,
                                                            left:
                                                                branchDropdownRef.current?.getBoundingClientRect()
                                                                    .left || 0,
                                                            width:
                                                                branchDropdownRef.current?.getBoundingClientRect()
                                                                    .width ||
                                                                'auto',
                                                        }}
                                                        onClick={e =>
                                                            e.stopPropagation()
                                                        }>
                                                        {branches.map(
                                                            branch => (
                                                                <div
                                                                    key={
                                                                        branch.id
                                                                    }
                                                                    onClick={() =>
                                                                        handleBranchSelect(
                                                                            branch,
                                                                        )
                                                                    }
                                                                    className="flex items-center justify-between px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                                                                    <div className="flex items-center">
                                                                        <Building className="mr-3 h-4 w-4 text-gray-500" />
                                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                            {
                                                                                branch.name
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    {selectedBranch ===
                                                                        branch.id.toString() && (
                                                                        <Check className="h-4 w-4 text-blue-600" />
                                                                    )}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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
                                        <Label htmlFor="price">Precio</Label>
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
                                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
