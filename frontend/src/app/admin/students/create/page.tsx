'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudents } from '@/hooks/students'

interface Student {
    id?: number
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    status: string
}

export default function CreateStudentPage() {
    const router = useRouter()
    const { createStudent } = useStudents()

    const [formData, setFormData] = useState<Student>({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
        status: 'pendiente',
    })

    const [errors, setErrors] = useState<
        Partial<Record<keyof Student | 'general', string[]>>
    >({})

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
            await createStudent(data)
            router.push('/admin/students') // Redirige a la lista después de crear
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
                                errors: Partial<Record<keyof Student, string[]>>
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
                                        Record<keyof Student, string[]>
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
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-zinc-950 shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
                Crear Estudiante
            </h1>
            {errors.general && (
                <div className="mb-4 text-red-500">
                    {errors.general.map((err, idx) => (
                        <p key={idx}>{err}</p>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />
                <InputField
                    label="Apellido"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    error={errors.last_name}
                />
                <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <InputField
                    label="Teléfono"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                />
                <InputField
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    error={errors.dni}
                />
                <div>
                    <label className="block font-medium text-sm text-gray-700 dark:text-white">
                        Estado
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full border rounded-md shadow-sm dark:text-white dark:border-white p-1">
                        <option value="pendiente">Pendiente</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status[0]}
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    Guardar
                </button>
            </form>
        </div>
    )
}

// Componente reutilizable para campos de entrada
type InputProps = {
    label: string
    name: keyof Student
    type?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    error?: string[]
}

const InputField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
}: InputProps) => (
    <div>
        <label
            htmlFor={name}
            className="block font-medium text-sm text-gray-700 dark:text-white">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className={`mt-1 block w-full border ${
                error ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm`}
        />
        {error && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
)
