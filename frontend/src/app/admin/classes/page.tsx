'use client'

import { useClasses } from "@/hooks/classes"
import { useEffect, useState } from "react"

export default function Class() {
    const { getClasses, getClass, createClass, updateClass, deleteClass } = useClasses()
    const [classes, setClasses] = useState<any[]>()
    // Fetch data from API
    const fetchData = async () => {
        try {
            const response = await getClasses()
            setClasses(response.classes)
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    // Load all on first render
    useEffect(() => {
        fetchData()
    }, [])
    console.log(classes);

    return (
        <>
            <h1>Page</h1>
            <p>Page content</p>
            {/* Render classes */}
            {classes?.map((c) => (
                <div key={c.id}>
                    <h2>{c.plan.name}</h2>
                    <p>{c.plan.description}</p>
                    <p>{c.plan.status}</p>
                    <hr />
                    <h3>{c.schedule.days}</h3>
                    <p>{c.student.name}</p>
                    <p>{c.student.last_name}</p>
                    <p>{c.student.dni}</p>
                </div>

            ))}
        </>
    )
}
