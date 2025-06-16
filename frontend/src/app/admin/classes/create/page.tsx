'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ArrowLeft,
    BookOpen,
    Users,
    DollarSign,
    Calendar,
    Clock,
    Save,
    X,
} from 'lucide-react'
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
import { Checkbox } from '@/app/admin/components/ui/checkbox'
import { toast } from '@/hooks/use-toast'
import { useClasses } from '@/hooks/classes'
import { type Plan, usePlans } from '@/hooks/plans'
import { type Branch, useBranches } from '@/hooks/branches'
import { useClassSchedules } from '@/hooks/classSchedules'

export default function CreateClassPage() {
    const router = useRouter()
    const { createClass } = useClasses()
    const { createClassSchedule } = useClassSchedules()
    const { getPlans } = usePlans()
    const { getBranches } = useBranches()

    const [isLoading, setIsLoading] = useState(false)
    const [plans, setPlans] = useState<Plan[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const [selectedDays, setSelectedDays] = useState<string[]>([])

    const [formData, setFormData] = useState({
        selectedPlan: '',
        selectedBranch: '',
        startTime: '',
        endTime: '',
        price: '',
        maxStudents: '',
    })

    const daysOfWeek = [
        { id: 'lunes', label: 'Lunes' },
        { id: 'martes', label: 'Martes' },
        { id: 'miercoles', label: 'Miércoles' },
        { id: 'jueves', label: 'Jueves' },
        { id: 'viernes', label: 'Viernes' },
        { id: 'sabado', label: 'Sábado' },
        { id: 'domingo', label: 'Domingo' },
    ]

    const generateHourOptions = () => {
        const options = []
        for (let i = 6; i <= 22; i++) {
            const hour = i < 10 ? `0${i}` : `${i}`
            options.push({ value: `${hour}:00`, label: `${hour}:00` })
        }
        return options
    }

    const hourOptions = generateHourOptions()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [plansRes, branchesRes] = await Promise.all([
                    getPlans(),
                    getBranches(),
                ])
                setPlans(plansRes.plans || [])
                setBranches(branchesRes.branches || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        fetchData()
    }, [getPlans, getBranches])

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleDayChange = (day: string, checked: boolean) => {
        if (checked) {
            setSelectedDays([...selectedDays, day])
        } else {
            setSelectedDays(selectedDays.filter(d => d !== day))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const classFormData = new FormData()
            classFormData.append('plan_id', formData.selectedPlan)
            classFormData.append('branch_id', formData.selectedBranch)
            classFormData.append('precio', formData.price)
            classFormData.append('max_students', formData.maxStudents)

            const res = await createClass(classFormData)

            if (res.status === 'success (201)') {
                const classScheduleFormData = new FormData()
                classScheduleFormData.append('class_id', res.classe.id)
                selectedDays.forEach((day, index) => {
                    classScheduleFormData.append(`days[${index}]`, day)
                })
                classScheduleFormData.append('time_start', formData.startTime)
                classScheduleFormData.append('time_end', formData.endTime)

                await createClassSchedule(classScheduleFormData)

                toast({
                    title: 'Clase creada exitosamente',
                    description:
                        'La clase y su horario han sido configurados correctamente',
                    variant: 'default',
                })

                router.push('/admin/classes')
            }
        } catch (error) {
            console.error('Error creating class:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al crear la clase',
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
                                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                Nueva Clase
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Complete la información para crear una nueva
                                clase
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
                            href="/admin/classes"
                            className="hover:text-purple-600 dark:hover:text-purple-400">
                            Clases
                        </Link>
                        {' > '}
                        <span className="text-slate-900 dark:text-white">
                            Nueva Clase
                        </span>
                    </nav>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-xl border border-slate-200/50 dark:border-slate-700/50">
                        <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
                            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                Información de la Clase
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Plan and Branch Selection */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Plan y Sucursal
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label
                                            htmlFor="plan"
                                            className="text-slate-700 dark:text-slate-300 font-medium">
                                            Plan
                                        </Label>
                                        <select
                                            value={formData.selectedPlan}
                                            onChange={e =>
                                                handleInputChange(
                                                    'selectedPlan',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            required>
                                            <option value="">
                                                Seleccionar plan
                                            </option>
                                            {plans.map(plan => (
                                                <option
                                                    key={plan.id}
                                                    value={plan.id}>
                                                    {plan.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="branch"
                                            className="text-slate-700 dark:text-slate-300 font-medium">
                                            Sucursal
                                        </Label>
                                        <select
                                            value={formData.selectedBranch}
                                            onChange={e =>
                                                handleInputChange(
                                                    'selectedBranch',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            required>
                                            <option value="">
                                                Seleccionar sucursal
                                            </option>
                                            {branches.map(branch => (
                                                <option
                                                    key={branch.id}
                                                    value={branch.id}>
                                                    {branch.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Class Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Detalles de la Clase
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label
                                            htmlFor="price"
                                            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <DollarSign className="h-4 w-4" />
                                            Precio
                                        </Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.price}
                                            onChange={e =>
                                                handleInputChange(
                                                    'price',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="0.00"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="maxStudents"
                                            className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <Users className="h-4 w-4" />
                                            Máximo de Estudiantes
                                        </Label>
                                        <Input
                                            id="maxStudents"
                                            type="number"
                                            min="1"
                                            value={formData.maxStudents}
                                            onChange={e =>
                                                handleInputChange(
                                                    'maxStudents',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="20"
                                            className="mt-2 bg-white/50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-600"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Schedule */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                                    Horario
                                </h3>

                                {/* Days Selection */}
                                <div>
                                    <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium mb-3">
                                        <Calendar className="h-4 w-4" />
                                        Días de la semana
                                    </Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {daysOfWeek.map(day => (
                                            <div
                                                key={day.id}
                                                className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={day.id}
                                                    checked={selectedDays.includes(
                                                        day.id,
                                                    )}
                                                    onCheckedChange={checked =>
                                                        handleDayChange(
                                                            day.id,
                                                            checked === true,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor={day.id}
                                                    className="text-sm cursor-pointer">
                                                    {day.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <Clock className="h-4 w-4" />
                                            Hora de inicio
                                        </Label>
                                        <select
                                            value={formData.startTime}
                                            onChange={e =>
                                                handleInputChange(
                                                    'startTime',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            required>
                                            <option value="">
                                                Seleccionar hora
                                            </option>
                                            {hourOptions.map(hour => (
                                                <option
                                                    key={hour.value}
                                                    value={hour.value}>
                                                    {hour.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                                            <Clock className="h-4 w-4" />
                                            Hora de fin
                                        </Label>
                                        <select
                                            value={formData.endTime}
                                            onChange={e =>
                                                handleInputChange(
                                                    'endTime',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-2 w-full px-3 py-2 bg-white/50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                            required>
                                            <option value="">
                                                Seleccionar hora
                                            </option>
                                            {hourOptions.map(hour => (
                                                <option
                                                    key={hour.value}
                                                    value={hour.value}>
                                                    {hour.label}
                                                </option>
                                            ))}
                                        </select>
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
                                            Creando...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Save className="h-4 w-4" />
                                            Crear Clase
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
