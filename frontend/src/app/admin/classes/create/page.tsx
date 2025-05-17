'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import {
    BookOpen,
    Building,
    Users,
    DollarSign,
    CalendarRange,
    Calendar,
    Clock,
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
import { Plan, usePlans } from '@/hooks/plans'
import { Branch, useBranches } from '@/hooks/branches'
import { useRouter } from 'next/navigation'
import { Checkbox } from '../../components/ui/checkbox'
import { useClassSchedules } from '@/hooks/classSchedules'

// Mock data for plans and branches

export default function CreateClassPage() {
    const [selectedPlan, setSelectedPlan] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [price, setPrice] = useState('')
    const [maxStudents, setMaxStudents] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { createClass } = useClasses()
    const { createClassSchedule } = useClassSchedules()
    const router = useRouter()
    const [plans, setPlans] = useState<Plan[]>([])
    const [branches, setBranches] = useState<Branch[]>([])
    const { getPlans } = usePlans()
    const { getBranches } = useBranches()

    const handleDayChange = (day: string, checked: boolean) => {
        if (checked) {
            setSelectedDays([...selectedDays, day])
        } else {
            setSelectedDays(selectedDays.filter(d => d !== day))
        }
    }

    useEffect(() => {
        async function fetchPlans() {
            const res = await getPlans()
            setPlans(res.plans)
        }
        fetchPlans()
        async function fetchBranches() {
            const res = await getBranches()
            setBranches(res.branches)
        }
        fetchBranches()
    }, [getBranches, getPlans])
    // Days of the week
    const daysOfWeek = [
        { id: 'lunes', label: 'Lunes' },
        { id: 'martes', label: 'Martes' },
        { id: 'miercoles', label: 'Miércoles' },
        { id: 'jueves', label: 'Jueves' },
        { id: 'viernes', label: 'Viernes' },
        { id: 'sabado', label: 'Sábado' },
        { id: 'domingo', label: 'Domingo' },
    ]

    // Generate hours for select (only on-the-hour times)
    const generateHourOptions = () => {
        const options = []
        for (let i = 6; i <= 22; i++) {
            const hour = i < 10 ? `0${i}` : `${i}`
            options.push({ value: `${hour}:00`, label: `${hour}:00` })
        }
        return options
    }

    function getPlanName() {
        const planObj = plans.find(p => p.id == selectedPlan)
        return planObj?.name ?? ''
    }
    function getBranchName() {
        const branchObj = branches.find(b => b.id == selectedBranch)
        return branchObj?.name ?? ''
    }
    const hourOptions = generateHourOptions()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('plan_id', selectedPlan)
            formData.append('branch_id', selectedBranch)
            formData.append('precio', price)
            formData.append('max_students', maxStudents)

            const res = await createClass(formData)

            toast({
                title: 'Clase creada',
                description: 'La clase ha sido creada exitosamente',
                variant: 'success',
            })
            // If response is success, create class schedule
            if (res.status === "success (201)") {
                const classScheduleFormData = new FormData()
                classScheduleFormData.append('class_id', res.classe.id)
                selectedDays.forEach((day, index) => {
                    classScheduleFormData.append(`days[${index}]`, day)
                })
                classScheduleFormData.append('time_start', startTime)
                classScheduleFormData.append('time_end', endTime)
                for (const element of classScheduleFormData) {
                    console.log(element)
                }
                const classScheduleRes = await createClassSchedule(classScheduleFormData)
                console.log(classScheduleRes)
                toast({
                    title: 'Horario creado',
                    description: 'El horario ha sido creado exitosamente',
                    variant: 'success',
                })
            }
            // Reset form or redirect
            // router.push('/admin/classes')
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
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <BookOpen className="mr-2 h-6 w-6 text-primary" />
                    Crear Nueva Clase
                </h1>

                <Card className="bg-white rounded shadow-md dark:bg-zinc-950 dark:text-white">
                    <CardHeader>
                        <CardTitle className="dark:text-white">
                            Información de la Clase
                        </CardTitle>
                        <CardDescription>
                            Completa los detalles para crear una nueva clase en
                            el sistema.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Plan and Branch Selection */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Plan y Sucursal
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <div className="relative">
                                            <Select
                                                value={selectedPlan}
                                                onValueChange={setSelectedPlan}>
                                                <SelectTrigger id="plan" className="w-full">
                                                    {selectedPlan ? (
                                                        <span>{getPlanName()}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Seleccionar plan</span>
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {plans.map(plan => (
                                                        <SelectItem
                                                            key={plan.id}
                                                            value={plan.id}>
                                                            {plan.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <CalendarRange className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="branch">Sucursal</Label>
                                        <div className="relative">
                                            <Select
                                                value={selectedBranch}
                                                onValueChange={
                                                    setSelectedBranch
                                                }>
                                                <SelectTrigger
                                                    id="branch"
                                                    className="w-full">
                                                        {selectedPlan ? (
                                                        <span>{getBranchName()}</span>
                                                    ) : (
                                                        <span className="text-muted-foreground">Seleccionar plan</span>
                                                    )}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {branches.map(branch => (
                                                        <SelectItem
                                                            key={branch.id}
                                                            value={branch.id}>
                                                            {branch.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Building className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Detalles de la Clase
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-transparent">
                                    <div className="space-y-2">
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

                                    <div className="space-y-2">
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
                            <div>
                                <h1>Horario:</h1>
                                {/* Days Selection */}
                                <div className="space-y-3">
                                    <Label
                                        htmlFor="days"
                                        className="font-medium flex items-center">
                                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
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
                                    {/* Start Time */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="start_time"
                                            className="font-medium flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            Hora de inicio
                                        </Label>
                                        <Select
                                            value={startTime}
                                            onValueChange={setStartTime}>
                                            <SelectTrigger
                                                id="start_time"
                                                className="w-full">
                                                <SelectValue placeholder="Seleccionar hora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hourOptions.map(hour => (
                                                    <SelectItem
                                                        key={hour.value}
                                                        value={hour.value}>
                                                        {hour.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* End Time */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="end_time"
                                            className="font-medium flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                            Hora de fin
                                        </Label>
                                        <Select
                                            value={endTime}
                                            onValueChange={setEndTime}>
                                            <SelectTrigger
                                                id="end_time"
                                                className="w-full">
                                                <SelectValue placeholder="Seleccionar hora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hourOptions.map(hour => (
                                                    <SelectItem
                                                        key={hour.value}
                                                        value={hour.value}>
                                                        {hour.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button
                                className="bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                                type="button"
                                onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button
                                className="bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white"
                                type="submit"
                                disabled={isLoading}>
                                {isLoading ? 'Creando...' : 'Crear Clase'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
