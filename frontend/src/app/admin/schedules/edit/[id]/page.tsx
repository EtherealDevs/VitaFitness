'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { Calendar, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/Button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
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
import { Schedule, useSchedules } from '@/hooks/schedules'
import { useParams, useRouter } from 'next/navigation'

export default function EditSchedulePage() {
    const formatTime = (time: string) => time?.substring(0, 5)
    const { id } = useParams()
    const { updateSchedule, getSchedule } = useSchedules()
    const [schedule, setSchedule] = useState<Schedule>({
        id: '',
        day: '',
        start_time: '',
        end_time: '',
    })
    const router = useRouter()
    const fetchData = async () => {
        try {
            const response = await getSchedule(id as string)
            console.log(response)
            setSchedule(response.schedule)
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSchedule(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        const formData = new FormData()
        formData.append('day', String(schedule?.day))
        formData.append('start_time', formatTime(schedule?.start_time))
        formData.append('end_time', formatTime(schedule?.end_time))
        try {
            updateSchedule(id as string, formData)
            router.push('/admin/schedules')
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-primary" />
                    Crear Nuevo Horario
                </h1>

                <Card className="bg-white rounded shadow-md dark:bg-zinc-950 dark:text-white">
                    <CardHeader>
                        <CardTitle>Información del Horario</CardTitle>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Day Selection */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="day"
                                        className="font-medium">
                                        Día de la semana
                                    </Label>
                                    <Select
                                        value={schedule.day}
                                        onValueChange={value =>
                                            setSchedule(prevSchedule => ({
                                                ...prevSchedule,
                                                day: value,
                                            }))
                                        }>
                                        <SelectTrigger
                                            id="day"
                                            className="w-full">
                                            <SelectValue placeholder="Seleccionar día" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lunes">
                                                Lunes
                                            </SelectItem>
                                            <SelectItem value="martes">
                                                Martes
                                            </SelectItem>
                                            <SelectItem value="miercoles">
                                                Miércoles
                                            </SelectItem>
                                            <SelectItem value="jueves">
                                                Jueves
                                            </SelectItem>
                                            <SelectItem value="viernes">
                                                Viernes
                                            </SelectItem>
                                            <SelectItem value="sabado">
                                                Sábado
                                            </SelectItem>
                                            <SelectItem value="domingo">
                                                Domingo
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Start Time */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="start_time"
                                        className="font-medium">
                                        Hora de inicio
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="time"
                                            id="start_time"
                                            name="start_time"
                                            value={schedule.start_time}
                                            onChange={handleInputChange}
                                            className="p-1 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* End Time */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="end_time"
                                        className="font-medium">
                                        Hora de fin
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            type="time"
                                            id="end_time"
                                            name="end_time"
                                            value={schedule.end_time}
                                            onChange={handleInputChange}
                                            className="p-1 rounded-md"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-muted/40 p-4 rounded-lg">
                                <h3 className="text-sm font-medium mb-2 flex items-center">
                                    <ChevronRight className="h-4 w-4 mr-1" />
                                    Vista previa
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {schedule.day ? (
                                        <>
                                            <span className="font-medium capitalize">
                                                {schedule.day}
                                            </span>
                                            {schedule.start_time &&
                                            schedule.end_time ? (
                                                <>
                                                    {' '}
                                                    de{' '}
                                                    {formatTime(
                                                        schedule.start_time,
                                                    )}{' '}
                                                    a{' '}
                                                    {formatTime(
                                                        schedule.end_time,
                                                    )}
                                                </>
                                            ) : (
                                                <> (horario no especificado)</>
                                            )}
                                        </>
                                    ) : (
                                        'Selecciona un día y horario para ver la vista previa'
                                    )}
                                </p>
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-between border-t pt-6">
                            <Button type="button">Cancelar</Button>
                            <Button type="submit">Guardar Horario</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
