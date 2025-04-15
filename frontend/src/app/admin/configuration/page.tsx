'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Switch } from '../components/ui/switch'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'

export default function ConfigurationPage() {
    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold">Configuración</h1>

            <Tabs defaultValue="general" className="mt-6">
                <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notificaciones
                    </TabsTrigger>
                    <TabsTrigger value="security">Seguridad</TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración General</CardTitle>
                            <CardDescription>
                                Administra la configuración general de la
                                aplicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="dark-mode">Modo Oscuro</Label>
                                <Switch id="dark-mode" />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="notifications">
                                    Notificaciones
                                </Label>
                                <Switch id="notifications" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Zona Horaria</Label>
                                <Input
                                    id="timezone"
                                    defaultValue="America/Mexico_City"
                                />
                            </div>
                            <Button>Guardar Cambios</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Añade más contenido para las otras pestañas según sea necesario */}
            </Tabs>
        </div>
    )
}
