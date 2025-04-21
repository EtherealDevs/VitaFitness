'use client'

import { useBranches } from "@/hooks/branches";
import { useClasses } from "@/hooks/classes"
import { usePlans } from "@/hooks/plans";
import { useClassStudents } from "@/hooks/classStudents"
import { useClassTeachers } from "@/hooks/classTeachers"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { use } from 'react';

interface Timeslot {
    id: number
    hour: string
    classStudents: ClassStudent[]
    classTeachers: ClassTeacher[]
}

interface Schedule {
    id: number
    selectedDays: string[]
    timeslots: Timeslot[]
    time_start: string
    time_end: string
}

interface Plan {
    id: number
    name: string
    description: string
    status: string
}

interface Branch {
    id: number
    name: string
    address: string
}

interface Class {
    id: string
    name: string
    max_students: number
    plan: Plan
    branch: Branch
    precio: number
    schedules: Schedule[]
    timeslots: Timeslot[]
}
interface ClassStudent {
    id: string
    student: Student
}
interface ClassTeacher {
    id: string
    teacher: Teacher
}
interface Student {
    id: string
    name: string
    last_name: string
    registration_date: string
    status: "activo" | "inactivo" | "pendiente"
    email: string
    phone: string
    dni: string
}
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
}

export default function ShowClassPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { getClass, deleteClass, updateClass } = useClasses();
    const { getBranches } = useBranches()
    const { getPlans } = usePlans()
    const { updateClassStudent, deleteClassStudent, createClassStudent } = useClassStudents()
    const { updateClassTeacher, deleteClassTeacher, createClassTeacher } = useClassTeachers()

    const [classData, setClassData] = useState<Class>()
    const [branches, setBranches] = useState<Branch[]>([])
    const [plans, setPlans] = useState<Plan[]>([])

    const fetchClasses = async () => {
        try {
            const response = await getClass(id as string)
            setClassData(response.classe)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchClasses()
    }, [getClass])

    const fetchBranches = async () => {
        try {
            const response = await getBranches()
            setBranches(response.branches)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchBranches()
    }, [branches])
    const fetchPlans = async () => {
        try {
            const response = await getPlans()
            setPlans(response.plans)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        fetchPlans()
    }, [plans])
    console.log(classData, branches, plans)
    const fetchAllData = async () => {
        await fetchClasses()
        await fetchBranches()
        await fetchPlans()
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log(classData)
    }
    const removeStudent = (classStudent: ClassStudent) => {
        try {
            const res = deleteClassStudent(classStudent.id)
            console.log(classStudent)
            console.log(res)
        } catch (error) {
            console.error(error)
        }
        fetchAllData();
    }

    return (
        <div>
            <h1>Show Class Page</h1>
                <form onSubmit={handleSubmit}>
                <div>
                <h2>Clase</h2>
                    <label htmlFor="max_students">
                        Máximo de estudiantes:
                        <input type="text" value={classData?.max_students} />
                    </label>
                    <label htmlFor="plan_id">
                        Plan:
                        <select name="plan_id" id="plan_id">
                            <option value="">Seleccionar plan</option>
                            {plans.map((plan, index) => {
                                var selected = false;
                                if (plan.name == classData?.plan.name) {
                                    selected = true;
                                }
                                return (
                                    <option selected={selected} key={index} value={plan.id}>{plan.name}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label htmlFor="branch_id">
                        Sucursal:
                        <select name="branch_id" id="branch_id">
                            <option value="">Seleccionar sucursal</option>
                            {branches.map((branch, index) => {
                                var selected = false;
                                if (branch.name == classData?.branch.name) {
                                    selected = true;
                                }
                                return (
                                    <option selected={selected} key={index} value={branch.id}>{branch.name}</option>
                                )
                            })}
                        </select>
                    </label>
                    <label htmlFor="precio">
                        Precio:
                        <input type="number" step={1} defaultValue={classData?.precio} />
                    </label>
                </div>
                <div>
                    <h2>Horarios</h2>
                    {classData?.schedules.map((schedule, index) => {

                        return (
                            <div key={index}>
                                <p>{schedule.selectedDays?.join(', ')}</p>
                                {schedule.timeslots?.map((timeslot, index) => {
                                    return (
                                        <p key={index}>{timeslot.hour} - Estudiantes: {timeslot.classStudents.map((classStudent, index) => {
                                            return (
                                                <span key={index}>{classStudent.student?.name}<button onClick={() => removeStudent(classStudent)}>Eliminar</button></span>
                                            )
                                        })} - Profesores: {timeslot.classTeachers.map((classTeacher, index) => {
                                            return (
                                                <span key={index}>{classTeacher.teacher?.name}</span>
                                            )
                                        })}</p>
                                    )
                                })}
                            </div>
                        )
                    })}
                    {/* <button onClick={addStudent}>Agregar estudiante</button>
                    <button onClick={addTeacher}>Agregar profesor</button>
                    <button onClick={() => removeTeacher(teacher)}>Eliminar</button> */}
                </div>
                </form>
        </div>
    )
}