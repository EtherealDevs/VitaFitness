'use client'

import { LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { useEffect, useState } from 'react'
interface UserNavProps {
    admin: {
        name: string
        email: string
        roles: { name: string }[]
        dni: string
    } // Replace 'any' with the appropriate type if known
}
export function UserNav({ admin }: UserNavProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex items-center gap-4 text-black dark:text-white">
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
                            <span className="font-medium">
                                Admin {admin.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {admin.email}
                            </span>
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal text-black dark:text-white">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                                {admin.name}
                            </p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {admin.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
