import { Card, CardContent } from "@/components/ui/card"
import { Users, DollarSign, Percent, Activity } from "lucide-react"

const metrics = [
    {
        label: "Total Socios activos",
        value: "240",
        subtext: "+20% desde el mes pasado",
        icon: Users,
    },
    {
        label: "Valor total",
        value: "$3,459,090.00",
        subtext: "+15% desde el mes pasado",
        icon: DollarSign,
    },
    {
        label: "Tasa de retención",
        value: "85%",
        subtext: "Tasa de retención",
        icon: Percent,
    },
    {
        label: "Usuarios Nuevos",
        value: "40",
        subtext: "Usuarios Nuevos",
        icon: Activity,
    },
]

export function MainMetrics() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <Card key={metric.label}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{metric.label}</p>
                                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{metric.subtext}</p>
                            </div>
                            <metric.icon className="w-5 h-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

