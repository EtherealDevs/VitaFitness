"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const sections = [
    { id: "nav", label: "NAV", color: "white" },
    { id: "shop", label: "SHOP", color: "#E4405F" },
    { id: "planes", label: "PLANES", color: "#A855F7" },
    { id: "nosotros", label: "NOSOTROS", color: "white" },
    { id: "galeria", label: "GALERIA", color: "white" },
    { id: "preguntas", label: "PREGUNTAS", color: "white" },
    { id: "contact", label: "CONTACT", color: "white" },
    { id: "footer", label: "FOOTER", color: "white" },
]

const MARKS_PER_SECTION = 5 // Número de marcas pequeñas entre cada sección

export default function NavigationGuide() {
    const [activeSection, setActiveSection] = useState("nav")

    useEffect(() => {
        const observers = sections.map((section) => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(section.id)
                        }
                    })
                },
                {
                    threshold: 0.5,
                },
            )

            const element = document.getElementById(section.id)
            if (element) observer.observe(element)

            return observer
        })

        return () => {
            observers.forEach((observer) => observer.disconnect())
        }
    }, [])

    return (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 h-3/4 flex items-center z-50">
            <div className="relative h-full flex items-center">
                {/* Línea vertical principal */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-gray-800" />

                {/* Contenedor de secciones y marcas */}
                <div className="relative flex flex-col justify-between h-full py-4">
                    {sections.map((section, sectionIndex) => (
                        <div key={section.id} className="relative">
                            {/* Marcas pequeñas antes de cada sección */}
                            {sectionIndex > 0 &&
                                Array.from({ length: MARKS_PER_SECTION }).map((_, index) => (
                                    <div
                                        key={`${section.id}-mark-${index}`}
                                        className="absolute w-2 h-[1px] bg-gray-800"
                                        style={{
                                            left: 0,
                                            top: `${-(MARKS_PER_SECTION - index) * (100 / (sections.length * MARKS_PER_SECTION))}%`,
                                        }}
                                    />
                                ))}

                            {/* Sección principal */}
                            <div className="flex items-center">
                                <div className="w-6 h-[1px] bg-gray-800" />
                                <motion.span
                                    className="ml-2 text-sm font-impact whitespace-nowrap"
                                    style={{ color: section.color }}
                                    initial={{ opacity: 0.5 }}
                                    animate={{
                                        opacity: activeSection === section.id ? 1 : 0.5,
                                        x: activeSection === section.id ? 4 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {section.label}
                                </motion.span>

                                {/* Indicador activo */}
                                {activeSection === section.id && (
                                    <motion.div
                                        layoutId="activeSection"
                                        className="absolute left-0 w-6 h-[2px]"
                                        style={{
                                            background: `linear-gradient(to right, #4ade80, #a855f7)`,
                                            top: `${(sectionIndex / (sections.length - 1)) * 100}%`,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

