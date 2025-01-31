import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const Faq = () => {
    const faqs = [
        {
            question: "¿Cuál es el horario del gimnasio?",
            answer:
                "Nuestro gimnasio está abierto de lunes a viernes de 6:00 AM a 10:00 PM, y los sábados y domingos de 8:00 AM a 8:00 PM.",
        },
        {
            question: "¿Ofrecen entrenamiento personal?",
            answer:
                "Sí, ofrecemos servicios de entrenamiento personal. Puedes contratar sesiones individuales o incluirlas en nuestro Plan Premium.",
        },
        {
            question: "¿Cuál es la política de cancelación de membresía?",
            answer:
                "Puedes cancelar tu membresía en cualquier momento con un aviso de 30 días. No hay penalizaciones por cancelación.",
        },
        {
            question: "¿Tienen duchas y vestuarios?",
            answer: "Sí, contamos con duchas y vestuarios completamente equipados para tu comodidad.",
        },
    ]

    return (
        <section id="faq" className="py-16 bg-black">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold mb-12 text-center">Preguntas Frecuentes</h2>
                <Accordion type="single" collapsible className="w-full max-w-2xl mx-auto">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                            <AccordionContent>{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}

export default Faq

