"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link"

export type Student = {
    id: string
    name: string
    last_name: string
    registration_date: string
    status: "activo" | "inactivo" | "pendiente"
    email: string
    phone: string
    dni: string
}

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
        cell: ({ row }) => {
            return (
                <div className="flex items-center">
                    <Link href={`/admin/students/${row.original.id}`} className="font-medium">
                        {row.getValue("name")}
                    </Link>
                </div>
            )
        },
    },
    {
        accessorKey: 'last_name',
        header: "Apellido",
    },
    {
        accessorKey: "status",
        header: "Estado",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "activo" ? "success" : status === "pendiente" ? "warning" : "destructive"}>
                    {status === "activo" ? "Activo" : status === "pendiente" ? "Pendiente" : "Inactivo"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "dni",
        header: "DNI",
    },
    {
        accessorKey: "phone",
        header: "Teléfono",
    },
    {
        accessorKey: "registration_date",
        header: "Fecha de registro",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(student.id)}>Copiar ID</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/admin/students/${student.id}`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

