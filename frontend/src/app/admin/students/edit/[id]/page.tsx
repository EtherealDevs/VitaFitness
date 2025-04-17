'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useStudents } from '@/hooks/students'
import { AxiosError } from 'axios'

interface Student {
    id?: number
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    status: string
}

type ValidationErrors = Partial<Record<keyof Student | 'general', string[]>>

export default function EditStudentPage() {
    const router = useRouter()
    const params = useParams()
    const { id } = params as { id: string }

    const { getStudent, updateStudent } = useStudents()

    const [formData, setFormData] = useState<Student>({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        dni: '',
        status: 'pendiente',
    })

    const [errors, setErrors] = useState<ValidationErrors>({})
    const [loading, setLoading] = useState(true)

    const fetchStudent = useCallback(async () => {
        try {
            const res = await getStudent(id)
            const student = res.student
            setFormData({
                name: student.name,
                last_name: student.last_name,
                email: student.email,
                phone: student.phone,
                dni: student.dni,
                status: student.status,
            })
        } catch (error) {
            console.error(error)
            setErrors({ general: ['Error al obtener el estudiante.'] })
        } finally {
            setLoading(false)
        }
    }, [getStudent])
    useEffect(() => {
        fetchStudent()
    }, [fetchStudent])

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
            await updateStudent(id, data)
            router.push('/admin/students')
        } catch (error) {
            const err = error as AxiosError<{ errors: ValidationErrors }>
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                console.error(err)
                setErrors({ general: ['Ocurrió un error inesperado.'] })
            }
        }
    }

    if (loading) {
        return (
            <div className="text-center mt-10 text-gray-600">
                Cargando estudiante...
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-lg dark:bg-zinc-950">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">
                Editar Estudiante
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
                        className="mt-1 block w-full border p-1 rounded-md shadow-sm dark:text-white dark:border-white">
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
                    Guardar cambios
                </button>
            </form>
        </div>
    )
}

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
            } rounded-md shadow-sm dark:text-white`}
        />
        {error && <p className="text-sm text-red-500">{error[0]}</p>}
    </div>
)
