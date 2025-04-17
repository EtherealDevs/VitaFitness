'use client'

import type React from 'react'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import Link from 'next/link'
/* import Logo from "@/components/Logo" */
import { AtSign, Lock, Eye, EyeOff, User } from 'lucide-react'
import Image from 'next/image'

const Register = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/',
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [dni, setDni] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false)
    const [errors, setErrors] = useState<{
        name?: string[]
        email?: string[]
        dni?: string[]
        password?: string[]
        password_confirmation?: string[]
    }>({})

    const submitForm = (event: React.FormEvent) => {
        event.preventDefault()

        register({
            name,
            email,
            dni,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row">
            {/* Imagen lateral (visible solo en desktop) */}
            <div className="hidden md:block md:w-1/2 relative">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <Image
                    src="https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1470&auto=format&fit=crop"
                    alt="Gym background"
                    fill
                    className="object-cover grayscale"
                    priority
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-12">
                    <div className="mb-8">{/*  <Logo size="lg" /> */}</div>
                    <h1 className="title-font text-6xl mb-6 text-white text-center">
                        ÚNETE A NOSOTROS
                    </h1>
                    <p className="text-xl text-gray-200 text-center max-w-md">
                        Comienza tu transformación hoy. Regístrate para acceder
                        a todos nuestros servicios y comenzar tu camino hacia
                        una mejor versión de ti mismo.
                    </p>
                </div>
            </div>

            {/* Formulario de registro */}
            <div className="w-full md:w-1/2 bg-black flex flex-col">
                <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 sm:px-12">
                    {/* Logo (visible solo en mobile) */}
                    <div className="md:hidden mb-12">
                        {/*       <Logo size="lg" /> */}
                    </div>

                    <div className="w-full max-w-md">
                        <div className="bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-800">
                            <h2 className="title-font text-4xl mb-6 text-center gradient-text text-white">
                                REGISTRO
                            </h2>

                            <form onSubmit={submitForm} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="title-font text-lg text-white block mb-2">
                                        Nombre
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={name}
                                            className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                            onChange={event =>
                                                setName(event.target.value)
                                            }
                                            required
                                            autoFocus
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>

                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.name.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Email Address */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="title-font text-lg text-white block mb-2">
                                        Email
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <AtSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                            onChange={event =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.email.join(', ')}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label
                                        htmlFor="dni"
                                        className="title-font text-lg text-white block mb-2">
                                        DNI
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <AtSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="dni"
                                            name="dni"
                                            type="dni"
                                            value={dni}
                                            className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                            onChange={event =>
                                                setDni(event.target.value)
                                            }
                                            required
                                            placeholder="12345678"
                                        />
                                    </div>

                                    {errors.dni && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.dni.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="title-font text-lg text-white block mb-2">
                                        Contraseña
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={password}
                                            className="block w-full pl-10 pr-10 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                            onChange={event =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="text-gray-400 hover:text-white focus:outline-none">
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.password.join(', ')}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label
                                        htmlFor="passwordConfirmation"
                                        className="title-font text-lg text-white block mb-2">
                                        Confirmar Contraseña
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="passwordConfirmation"
                                            name="password_confirmation"
                                            type={
                                                showPasswordConfirmation
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            value={passwordConfirmation}
                                            className="block w-full pl-10 pr-10 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                            onChange={event =>
                                                setPasswordConfirmation(
                                                    event.target.value,
                                                )
                                            }
                                            required
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPasswordConfirmation(
                                                        !showPasswordConfirmation,
                                                    )
                                                }
                                                className="text-gray-400 hover:text-white focus:outline-none">
                                                {showPasswordConfirmation ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.password_confirmation.join(
                                                ', ',
                                            )}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-transparent border-2 border-teal-400 text-white px-6 py-3 rounded-full hover:bg-teal-400 hover:text-black transition-colors title-font text-lg flex items-center justify-center mt-8">
                                    REGISTRARSE
                                </button>
                            </form>

                            <div className="mt-8 text-center">
                                <p className="text-gray-400">
                                    ¿Ya tienes una cuenta?{' '}
                                    <Link
                                        href="/login"
                                        className="text-teal-400 hover:text-teal-300 transition-colors">
                                        Inicia sesión
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Beneficios de registrarse */}
                        <div className="mt-12 space-y-4">
                            <div className="flex items-start">
                                <div className="bg-teal-400/10 p-2 rounded-full mr-4 mt-1">
                                    <svg
                                        className="h-5 w-5 text-teal-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="title-font text-white text-lg">
                                        Acceso a planes exclusivos
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Desbloquea planes de entrenamiento
                                        personalizados
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="bg-teal-400/10 p-2 rounded-full mr-4 mt-1">
                                    <svg
                                        className="h-5 w-5 text-teal-400"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="title-font text-white text-lg">
                                        Seguimiento de progreso
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        Monitorea tus avances y resultados
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4 text-center text-gray-500 text-sm border-t border-zinc-800">
                    VITA FITNESS | Todos los derechos reservados
                </div>
            </div>
        </div>
    )
}

export default Register
