import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

const quickAccessItems = [
    { title: 'ROLES Y PERMISOS', href: '#' },
    { title: 'ROLES', href: '#' },
    { title: 'AREAS', href: '#' },
    { title: 'ROLES', href: '#' },
    { title: 'HORARIOS', href: '#' },
    { title: 'ALUMNOS', href: '#' },
    { title: 'AREAS', href: '#' },
    { title: 'ROLES', href: '#' },
]

export function QuickAccess() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Accesos directos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickAccessItems.map((item, index) => (
                        <Button
                            key={index}
                            className="h-auto py-4 px-6 flex items-center justify-between">
                            {item.title}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
