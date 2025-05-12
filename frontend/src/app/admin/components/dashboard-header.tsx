'use client'

import { UserNav } from './user-nav'
import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { DashboardNav } from './dashboard-nav'
import { ModeToggle } from './client/mode-toggle'
import Image from 'next/image'

interface DashboardHeaderProps {
    admin: {
        name: string
        email: string
        roles: { name: string }[]
        dni: string
    } // Replace 'any' with the appropriate type if known
}

export function DashboardHeader({ admin }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 w-full items-center bg-white px-4 dark:bg-gray-900 shadow-sm">
            <div className="flex flex-1 items-center gap-4 ">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex h-14 items-center border-b px-4">
                            <Image
                                width={'8'}
                                height={'8'}
                                src="/favicon.ico"
                                alt="Logo"
                                className="h-8 w-8"
                            />
                            <span className="ml-2 text-lg font-semibold">
                                Training App
                            </span>
                        </div>
                        <DashboardNav />
                    </SheetContent>
                </Sheet>

                {/* Logo y nombre de la aplicación */}
                <div className="hidden md:flex md:items-center">
                    {/* <Image
                        width={'8'}
                        height={'8'}
                        src="/placeholder.svg?height=32&width=32"
                        alt="Logo"
                        className="h-8 w-8"
                    /> */}
                </div>
            </div>

            <div className="ml-auto flex items-center gap-2 text-black dark:text-white">
                {/* Botón de cambio de tema */}
                <ModeToggle />
                <UserNav admin={admin} />
            </div>
        </header>
    )
}
