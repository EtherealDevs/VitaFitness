'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Calendar, ChevronRight, BookOpen } from 'lucide-react'

import { Button } from '@/app/admin/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import Label from '@/components/ui/Label'
import { Checkbox } from '@/app/admin/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
// import { useSchedules } from '@/hooks/schedules'
import { Class, useClasses } from '@/hooks/classes'
import { useClassSchedules } from '@/hooks/classSchedules'

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

const hourOptions = generateHourOptions()

export default function CreateSchedulePage() {
    const router = useRouter()
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedDays, setSelectedDays] = useState<string[]>([])
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { createClassSchedule } = useClassSchedules()
    const { getClasses } = useClasses()
    const [classes, setClasses] = useState<Class[]>([])
    useEffect(() => {
        async function fetchClasses() {
            const res = await getClasses()
            setClasses(res.classes)
        }
        fetchClasses()
    }, [getClasses])
    console.log(classes)

    const handleDayChange = (day: string, checked: boolean) => {
        if (checked) {
            setSelectedDays([...selectedDays, day])
        } else {
            setSelectedDays(selectedDays.filter(d => d !== day))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (selectedDays.length === 0) {
            toast({
                title: 'Error',
                description: 'Debes seleccionar al menos un día de la semana',
                variant: 'destructive',
            })
            return
        }

        if (!startTime || !endTime) {
            toast({
                title: 'Error',
                description: 'Debes seleccionar horarios de inicio y fin',
                variant: 'destructive',
            })
            return
        }

        if (startTime >= endTime) {
            toast({
                title: 'Error',
                description:
                    'La hora de inicio debe ser anterior a la hora de fin',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)

        try {
            const formData = new FormData()
            formData.append('class_id', selectedClass)
            selectedDays.forEach((day, index) => {
                formData.append(`days[${index}]`, day)
            })
            formData.append('time_start', startTime)
            formData.append('time_end', endTime)
            for (const element of formData) {
                console.log(element)
            }
            const res = await createClassSchedule(formData)
            console.log(res)
            toast({
                title: 'Horario creado',
                description: 'El horario ha sido creado exitosamente',
                variant: 'success',
            })

            // Reset form or redirect
            router.push('/admin/schedules')
        } catch (error) {
            console.error('Error creating schedule:', error)
            toast({
                title: 'Error',
                description: 'Hubo un error al crear el horario',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Get class name for preview
    const getClassName = () => {
        const classObj = classes.find(c => c.id == String(selectedClass))
        const name = `${classObj?.plan?.name} (${classObj?.branch?.name})`
        return name
    }

    // Get day names for preview
    const getDayNames = () => {
        return selectedDays
            .sort((a, b) => {
                const indexA = daysOfWeek.findIndex(d => d.id === a)
                const indexB = daysOfWeek.findIndex(d => d.id === b)
                return indexA - indexB
            })
            .map(day => {
                const dayObj = daysOfWeek.find(d => d.id === day)
                return dayObj ? dayObj.label : ''
            })
            .join(', ')
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-primary" />
                    Crear Nuevo Horario
                </h1>

                <Card className="bg-white shadow-md rounded-md ">
                    <CardHeader>
                        <CardTitle>Información del Horario</CardTitle>
                        <CardDescription>
                            Selecciona la clase, días y horarios para crear un
                            nuevo horario.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Class Selection */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="class"
                                    className="font-medium flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                    Clase
                                </Label>
                                <Select
                                    value={selectedClass}
                                    onValueChange={setSelectedClass}>
                                    <SelectTrigger
                                        id="class"
                                        className="w-full">
                                        {/* aca falta algo */}
                                        {selectedClass && (
                                            <p>{' '}
                                                {getClassName()}
                                            </p>
                                        )}
                                        <SelectValue placeholder="Seleccionar clase" />
                                        
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map(classItem => (
                                            <SelectItem
                                                key={classItem.id}
                                                value={classItem.id}>
                                                {`${classItem?.plan?.name} (${classItem?.branch?.name})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

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

                            {/* Preview */}
                            {(selectedClass ||
                                selectedDays.length > 0 ||
                                startTime ||
                                endTime) && (
                                <div className="bg-muted/40 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium mb-2 flex items-center">
                                        <ChevronRight className="h-4 w-4 mr-1" />
                                        Vista previa
                                    </h3>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {selectedClass && (
                                            <p>
                                                <span className="font-medium">
                                                    Clase:
                                                </span>{' '}
                                                {getClassName()}
                                            </p>
                                        )}
                                        {selectedDays.length > 0 && (
                                            <p>
                                                <span className="font-medium">
                                                    Días:
                                                </span>{' '}
                                                {getDayNames()}
                                            </p>
                                        )}
                                        {startTime && endTime && (
                                            <p>
                                                <span className="font-medium">
                                                    Horario:
                                                </span>{' '}
                                                {startTime} a {endTime}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Guardando...' : 'Guardar Horario'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
