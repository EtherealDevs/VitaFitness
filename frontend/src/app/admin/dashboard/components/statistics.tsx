import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

const activityData = [
    {
        name: "Juan Pérez",
        email: "juan@example.com",
        amount: "$500.00",
    },
    {
        name: "Ana Pérez",
        email: "ana@example.com",
        amount: "$450.00",
    },
    {
        name: "Carlos Pérez",
        email: "carlos@example.com",
        amount: "$350.00",
    },
    {
        name: "María Pérez",
        email: "maria@example.com",
        amount: "$300.00",
    },
]

export function Statistics() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ESTADÍSTICAS DE LOS ÚLTIMOS 30 DÍAS</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">CUOTAS DE SOCIOS Y CLIENTES ACTIVOS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activityData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <Image
                                            src="/placeholder.svg"
                                            alt={`Avatar de ${item.name}`}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.email}</p>
                                        </div>
                                        <p className="text-sm font-medium text-red-500">{item.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Duplicate the card for other statistics sections */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">ACTIVIDAD Y PAGOS DE SOCIOS ANTIGUOS</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activityData.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <Image
                                            src="/placeholder.svg"
                                            alt={`Avatar de ${item.name}`}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.email}</p>
                                        </div>
                                        <p className="text-sm font-medium text-red-500">{item.amount}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">PROSPECTOS por Plan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">INTENSIVO</p>
                                        <p className="text-xs text-muted-foreground">2 usuarios nuevos</p>
                                    </div>
                                    <p className="text-sm font-medium text-red-500">$1,500.00</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">PLAN1</p>
                                        <p className="text-xs text-muted-foreground">5 usuarios nuevos</p>
                                    </div>
                                    <p className="text-sm font-medium text-red-500">$2,500.00</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">PREMIUM</p>
                                        <p className="text-xs text-muted-foreground">3 usuarios nuevos</p>
                                    </div>
                                    <p className="text-sm font-medium text-red-500">$3,500.00</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    )
}

