"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon } from "lucide-react"

const Faq = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        {
            question: "¿Ofrecen clases grupales?",
            answer:
                "Sí, ofrecemos una variedad de clases grupales como yoga, spinning, zumba y más. Estas están incluidas en todas nuestras membresías.",
        },
        {
            question: "¿Cuál es el costo de la membresía?",
            answer:
                "Ofrecemos varios planes de membresía que se adaptan a diferentes necesidades y presupuestos. Te invitamos a visitar nuestra sección de planes para más detalles.",
        },
    ]

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="w-full px-4 py-16 bg-black">
            <div className="max-w-4xl mx-auto">
                <h2 className="mb-8 text-center font-bold text-4xl font-impact uppercase text-white relative">
                    Preguntas Frecuentes
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/4 h-1 bg-gradient-to-r from-[#40E0D0] to-[#4834d4]" />
                </h2>
                <div className="grid gap-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden"
                        >
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                            >
                                <span className="text-lg font-semibold text-white">{faq.question}</span>
                                <ChevronDownIcon
                                    className={`w-6 h-6 text-[#40E0D0] transition-transform duration-300 ${openIndex === index ? "transform rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-4"
                                    >
                                        <p className="text-gray-300">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Faq

