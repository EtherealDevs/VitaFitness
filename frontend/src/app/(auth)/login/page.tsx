"use client"

import type React from "react"

import { useAuth } from "@/hooks/auth"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import AuthSessionStatus from "@/app/(auth)/AuthSessionStatus"

import { AtSign, Lock, Eye, EyeOff } from "lucide-react"

const Login = () => {
    const searchParams = useSearchParams()
    const resetParam = searchParams.get("reset")

    const { login } = useAuth({
        middleware: "guest",
        redirectIfAuthenticated: "/",
    })

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [shouldRemember, setShouldRemember] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<{
        email?: string[]
        password?: string[]
    }>({})
    const [status, setStatus] = useState<string | null>(null)

    useEffect(() => {
        if (resetParam && !errors.email && !errors.password) {
            setStatus(atob(resetParam))
        } else {
            setStatus(null)
        }
    }, [resetParam, errors])

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }

    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    {/* <Logo size="lg" /> */}
                </div>

                <div className="bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-800">
                    <h2 className="title-font text-4xl mb-6 text-center gradient-text">ACCESO</h2>

                    <AuthSessionStatus className="mb-4" status={status} />

                    <form onSubmit={submitForm} className="space-y-6">
                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="title-font text-lg text-white block mb-2">
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
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    autoFocus
                                    placeholder="tu@email.com"
                                />
                            </div>

                            {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.join(", ")}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="title-font text-lg text-white block mb-2">
                                Contraseña
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    className="block w-full pl-10 pr-10 py-3 bg-zinc-800 border-b border-gray-600 focus:border-teal-400 outline-none transition-colors rounded-md text-white"
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-white focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.join(", ")}</p>}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label htmlFor="remember_me" className="flex items-center">
                                <input
                                    id="remember_me"
                                    type="checkbox"
                                    name="remember"
                                    className="h-4 w-4 rounded border-gray-600 bg-zinc-800 text-teal-400 focus:ring-teal-400"
                                    onChange={(event) => setShouldRemember(event.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                            </label>

                            <Link href="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-transparent border-2 border-teal-400 text-white px-6 py-3 rounded-full hover:bg-teal-400 hover:text-black transition-colors title-font text-lg flex items-center justify-center"
                        >
                            INGRESAR
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            ¿No tienes una cuenta?{" "}
                            <Link href="/register" className="text-teal-400 hover:text-teal-300 transition-colors">
                                Regístrate
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">VITA FITNESS | Todos los derechos reservados</div>
            </div>
        </div>
    )
}

export default Login

