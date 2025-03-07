'use client'

import { CreditCard, LogOut, Settings, User, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useEffect, useState } from 'react'

export function UserNav() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex items-center gap-4 text-black dark:text-white">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 gap-2 pl-0 ">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src="/avatars/01.png"
                                alt="@username"
                            />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="hidden flex-col items-start text-sm md:flex">
                            <span className="font-medium">Admin User</span>
                            <span className="text-xs text-muted-foreground">
                                admin@example.com
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal text-black dark:text-white">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                Admin User
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                admin@example.com
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup className="text-black dark:text-white">
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Mi Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Facturación</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configuración</span>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
