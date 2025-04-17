'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Building,
    Search,
    Plus,
    Edit,
    Trash2,
    MapPin,
    MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/app/admin/components/ui/button'
import { Card, CardContent } from '@/app/admin/components/ui/card'
import { Input } from '@/app/admin/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/admin/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/app/admin/components/ui/dropdown-menu'
import { toast } from '@/hooks/use-toast'
import { Branch, useBranches } from '@/hooks/branches'
import { CardHeader, CardTitle } from '@/components/ui/card'

export default function BranchesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [branches, setBranches] = useState<Branch[]>([])
    const { getBranches } = useBranches()

    useEffect(() => {
        async function fetchBranches() {
            const res = await getBranches()
            setBranches(res?.branches || res?.data?.branches || [])
        }
        fetchBranches()
    }, [getBranches])

    const filteredBranches = branches.filter(
        branch =>
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDelete = (id: string) => {
        setBranches(branches.filter(branch => branch.id !== id))
        toast({
            title: 'Sucursal eliminada',
            description: 'La sucursal ha sido eliminada exitosamente',
            variant: 'success',
        })
    }

    return (
        <div className="space-y-6 p-6 max-w-full">
            {/* Título y Botón fuera de la Card */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Building className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl font-semibold">Sucursales</h1>
                </div>
                <div className="flex items-center gap-4">
                    {/* Input de búsqueda */}
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="search"
                            name="search"
                            type="text"
                            placeholder="Buscar sucursales..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {/* Botón Nueva Sucursal */}
                    <Button asChild>
                        <Link href="/admin/branches/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Sucursal
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Card de Sucursales */}
            <Card>
                <CardHeader className="flex flex-wrap flex-row items-center justify-between gap-2">
                    <CardTitle>Lista de Sucursales</CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredBranches.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Building className="mx-auto mb-4 w-10 h-10" />
                            <h3 className="text-lg font-semibold">
                                No se encontraron sucursales
                            </h3>
                            <p className="mb-4 text-sm">
                                {searchTerm
                                    ? 'No hay resultados que coincidan con tu búsqueda.'
                                    : 'Aún no hay sucursales registradas.'}
                            </p>
                            <Button asChild>
                                <Link href="/admin/branches/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Nueva Sucursal
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[250px]">
                                            Nombre
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Dirección
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Acciones
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBranches.map(branch => (
                                        <TableRow key={branch.id}>
                                            <TableCell>{branch.name}</TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <div className="flex items-start gap-1">
                                                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                                    <span>
                                                        {branch.address}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Acciones
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                router.push(
                                                                    `branches/edit/${branch.id}`,
                                                                )
                                                            }>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    branch.id,
                                                                )
                                                            }>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
