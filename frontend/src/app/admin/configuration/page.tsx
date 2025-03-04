import { Tabs } from "../components/ui/tabs"

export default function ConfigurationPage() {
  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold">Configuración</h1>
      <Tabs defaultValue="general" className="mt-6">
        {/* ... contenido de las pestañas ... */}
      </Tabs>
    </div>
  )
}

