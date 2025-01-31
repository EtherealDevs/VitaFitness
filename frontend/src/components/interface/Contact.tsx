import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const Contact = () => {
    return (
        <section id="contact" className="py-16 bg-gray-900">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">Contáctanos</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Información de contacto</h3>
                        <p className="mb-2">Dirección: 123 Calle Fitness, Ciudad Ejemplo</p>
                        <p className="mb-2">Teléfono: (123) 456-7890</p>
                        <p className="mb-2">Email: info@vitafitnessgym.com</p>
                    </div>
                    <div>
                        <form className="space-y-4">
                            <Input type="text" placeholder="Nombre" />
                            <Input type="email" placeholder="Email" />
                            <Textarea placeholder="Mensaje" />
                            <Button className="w-full bg-green-500 hover:bg-green-600">Enviar mensaje</Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Contact

