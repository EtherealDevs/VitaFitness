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
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Input from '@/components/ui/Input'
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

// Mock data for branches

export default function BranchesPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [branches, setBranches] = useState<Branch[]>([])
    const { getBranches } = useBranches()

    useEffect(() => {
        async function fetchBranches() {
            const res = await getBranches()
            setBranches(res.branches)
        }
        fetchBranches()
    }, [getBranches])

    // Filter branches based on search term
    const filteredBranches = branches.filter(
        branch =>
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleDelete = (id: string) => {
        // In a real app, you would call an API to delete the branch
        setBranches(branches.filter(branch => branch.id !== id))
        toast({
            title: 'Sucursal eliminada',
            description: 'La sucursal ha sido eliminada exitosamente',
            variant: 'success',
        })
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold flex items-center">
                    <Building className="mr-2 h-6 w-6 text-primary" />
                    Sucursales
                </h1>

                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="relative w-full sm:w-64 md:w-80">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Buscar sucursales..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 py-3 rounded-lg"
                        />
                    </div>

                    <Button>
                        <Link href="/admin/branches/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Sucursal
                        </Link>
                    </Button>
                </div>
            </div>

            {filteredBranches.length === 0 ? (
                <div className="bg-muted/40 rounded-lg p-8 text-center">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                        No se encontraron sucursales
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {searchTerm
                            ? 'No hay sucursales que coincidan con tu búsqueda. Intenta con otros términos.'
                            : 'Aún no hay sucursales registradas en el sistema.'}
                    </p>
                    <Button>
                        <Link href="/branches/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Nueva Sucursal
                        </Link>
                    </Button>
                </div>
            ) : (
                <>
                    {/* Table view for desktop */}
                    <div className="hidden md:block rounded-lg border overflow-hidden">
                        <Table>
                            <TableHeader className="dark:bg-zinc-950 dark:text-white">
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
                            <TableBody className="dark:bg-zinc-800 dark:text-white">
                                {filteredBranches.map(branch => (
                                    <TableRow key={branch.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                {branch.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex items-start">
                                                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-1 flex-shrink-0" />
                                                <span className="text-sm">
                                                    {branch.address}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Abrir menú
                                                        </span>
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
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() =>
                                                            handleDelete(
                                                                branch.id,
                                                            )
                                                        }>
                                                        <Trash2 className="h-4 w-4 mr-2" />
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

                    {/* Card view for mobile */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {filteredBranches.map(branch => (
                            <Card key={branch.id} className="overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-4 border-b">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">
                                                {branch.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 mr-2 flex-shrink-0" />
                                            <span className="text-sm">
                                                {branch.address}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex justify-between p-4 pt-0 gap-2">
                                    <Button
                                        className="flex-1"
                                        onClick={() =>
                                            router.push(
                                                `branches/edit/${branch.id}`,
                                            )
                                        }>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                    <Button
                                        className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                                        onClick={() => handleDelete(branch.id)}>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
