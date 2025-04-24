'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plan, usePlans } from '@/hooks/plans'
import { Label } from '@/app/admin/components/ui/label'
import { Input } from '@/app/admin/components/ui/input'
import { Button } from '@/app/admin/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

export default function EditPlanPage() {
    const { id } = useParams()
    const router = useRouter()
    const { updatePlan, getPlan } = usePlans()

    const [formData, setFormData] = useState<Plan>({
        id: '',
        name: '',
        description: '',
        status: '',
    })

    const [errors, setErrors] = useState<
        Partial<Record<keyof Plan | 'general', string[]>>
    >({})

    const fetchPlan = useCallback(async () => {
        try {
            const response = await getPlan(id as string)
            setFormData(response.plan)
        } catch (error) {
            console.error(error)
            setErrors({ general: ['No se pudo cargar el plan.'] })
        }
    }, [getPlan, id])

    useEffect(() => {
        fetchPlan()
    }, [fetchPlan])

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: undefined }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const data = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            data.append(key, value)
        })

        try {
            await updatePlan(id as string, data)
            router.push('/admin/plans')
        } catch (error: unknown) {
            if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error &&
                (
                    error as {
                        response: {
                            status: number
                            data: {
                                errors: Partial<Record<keyof Plan, string[]>>
                            }
                        }
                    }
                ).response.status === 422
            ) {
                setErrors(
                    (
                        error as {
                            response: {
                                data: {
                                    errors: Partial<
                                        Record<keyof Plan, string[]>
                                    >
                                }
                            }
                        }
                    ).response.data.errors,
                )
            } else {
                setErrors({ general: ['Ocurrió un error inesperado.'] })
            }
        }
    }

    return (
        <div className="max-w-xl mx-auto mt-10">
            <Card>
                <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Editar Plan</h1>

                    {errors.general && (
                        <div className="mb-4 text-red-500">
                            {errors.general.map((err, idx) => (
                                <p key={idx}>{err}</p>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField
                            label="Nombre del plan"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                        />
                        <TextareaField
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                        <div>
                            <Label htmlFor="status">Estado</Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full border rounded-md shadow-sm p-2 text-sm dark:dark:bg-[#393d40]">
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-red-500 mt-1">
                                    {errors.status[0]}
                                </p>
                            )}
                        </div>
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/plans')}
                                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                                Cancelar
                            </Button>
                            <Button type="submit">Guardar Cambios</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

type InputProps = {
    label: string
    name: keyof Plan
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string[]
}

const InputField = ({ label, name, value, onChange, error }: InputProps) => (
    <div className="space-y-1">
        <Label htmlFor={name}>{label}</Label>
        <Input id={name} name={name} value={value} onChange={onChange} />
        {error && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
)

type TextareaProps = {
    label: string
    name: keyof Plan
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    error?: string[]
}

const TextareaField = ({
    label,
    name,
    value,
    onChange,
    error,
}: TextareaProps) => (
    <div className="space-y-1">
        <Label htmlFor={name}>{label}</Label>
        <Textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="resize-none dark:bg-[#393d40]"
        />
        {error && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
)
