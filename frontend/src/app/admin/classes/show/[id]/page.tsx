'use client'

import { ChevronRight, ChevronDown } from 'lucide-react'
import { useBranches } from '@/hooks/branches'
import { useClasses } from '@/hooks/classes'
import { usePlans } from '@/hooks/plans'
import { useClassStudents } from '@/hooks/classStudents'
import { useClassTeachers } from '@/hooks/classTeachers'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { use } from 'react'

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
    status: 'activo' | 'inactivo' | 'pendiente'
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

// export default function ShowClassPage({
//     params,
// }: {
//     params: Promise<{ id: string }>
// }) {
//     const { id } = use(params)

//     const { getClass, deleteClass, updateClass } = useClasses()
//     const { getBranches } = useBranches()
//     const { getPlans } = usePlans()
//     const { updateClassStudent, deleteClassStudent, createClassStudent } =
//         useClassStudents()
//     const { updateClassTeacher, deleteClassTeacher, createClassTeacher } =
//         useClassTeachers()

//     const [classData, setClassData] = useState<Class>()
//     const [branches, setBranches] = useState<Branch[]>([])
//     const [plans, setPlans] = useState<Plan[]>([])
//     const [students, setStudents] = useState<Student[]>([])

//     const [selectedAddableStudent, setSelectedAddableStudent] = useState<string>("");
//     const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedAddableStudent(event.target.value);
//     };

//     const fetchClasses = async () => {
//         try {
//             const response = await getClass(id as string)
//             setClassData(response.classe)
//         } catch (error) {
//             console.error(error)
//         }
//     }
//     useEffect(() => {
//         fetchClasses()
//     }, [getClass])

//     const fetchBranches = async () => {
//         try {
//             const response = await getBranches()
//             setBranches(response.branches)
//         } catch (error) {
//             console.error(error)
//         }
//     }
//     useEffect(() => {
//         fetchBranches()
//     }, [getBranches])
//     const fetchPlans = async () => {
//         try {
//             const response = await getPlans()
//             setPlans(response.plans)
//         } catch (error) {
//             console.error(error)
//         }
//     }
//     useEffect(() => {
//         fetchPlans()
//     }, [getPlans])
//     // const fetchStudents = async () => {
//     //     try {
//     //         const response = await getStudents()
//     //         setStudents(response.students)
//     //     } catch (error) {
//     //         console.error(error)
//     //     }
//     // }
//     // useEffect(() => {
//     //     fetchStudents()
//     // }, [getStudents])
//     const fetchAllData = async () => {
//         await fetchClasses()
//         await fetchBranches()
//         await fetchPlans()
//         // await fetchStudents()
//     }
//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         console.log(classData)
//     }
//     const removeStudent = async (classStudent: ClassStudent) => {
//         try {
//             const res = await deleteClassStudent(classStudent.id)
//             console.log(classStudent)
//             console.log(res)
//         } catch (error) {
//             console.error(error)
//         }
//         fetchAllData()
//     }
//     // const addStudent = async (timeslot: Timeslot) => {
//     //     let student_id = selectedAddableStudent
//     //     let classTimeslot = timeslot
//     //     const formData = new FormData()
//     //     formData.append('students[]', student_id)
//     //     formData.append('c_sch_ts_id', String(classTimeslot.id))
//     //     try {
//     //         const res = await createClassStudent(formData)
//     //         console.log(res)
//     //     } catch (error) {
//     //         console.error(error)
//     //     }
//     //     fetchAllData();
//     // }

//     return (
//         <div>
//             <h1>Show Class Page</h1>
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <h2>Clase</h2>
//                     <label htmlFor="max_students">
//                         Máximo de estudiantes:
//                         <input type="text" value={classData?.max_students} />
//                     </label>
//                     <label htmlFor="plan_id">
//                         Plan:
//                         <select name="plan_id" id="plan_id">
//                             <option value="">Seleccionar plan</option>
//                             {plans.map((plan, index) => {
//                                 var selected = false
//                                 if (plan.name == classData?.plan.name) {
//                                     selected = true
//                                 }
//                                 return (
//                                     <option
//                                         selected={selected}
//                                         key={index}
//                                         value={plan.id}>
//                                         {plan.name}
//                                     </option>
//                                 )
//                             })}
//                         </select>
//                     </label>
//                     <label htmlFor="branch_id">
//                         Sucursal:
//                         <select name="branch_id" id="branch_id">
//                             <option value="">Seleccionar sucursal</option>
//                             {branches.map((branch, index) => {
//                                 var selected = false
//                                 if (branch.name == classData?.branch.name) {
//                                     selected = true
//                                 }
//                                 return (
//                                     <option
//                                         selected={selected}
//                                         key={index}
//                                         value={branch.id}>
//                                         {branch.name}
//                                     </option>
//                                 )
//                             })}
//                         </select>
//                     </label>
//                     <label htmlFor="precio">
//                         Precio:
//                         <input
//                             type="number"
//                             step={1}
//                             defaultValue={classData?.precio}
//                         />
//                     </label>
//                 </div>
//                 <div>
//                     <h2>Horarios</h2>
//                     {classData?.schedules.map((schedule, index) => {
//                         return (
//                             <div key={index}>
//                                 <p>{schedule.selectedDays?.join(', ')}</p>
//                                 {schedule.timeslots?.map((timeslot, index) => {
//                                     return (
//                                         <p key={index}>
//                                             {timeslot.hour} - Estudiantes:{' '}
//                                             {timeslot.classStudents.map(
//                                                 (classStudent, index) => {
//                                                     return (
//                                                         <span key={index}>
//                                                             {
//                                                                 classStudent
//                                                                     .student
//                                                                     ?.name
//                                                             }
//                                                             <button
//                                                                 onClick={() =>
//                                                                     removeStudent(
//                                                                         classStudent,
//                                                                     )
//                                                                 }>
//                                                                 Eliminar
//                                                             </button>
//                                                         </span>
//                                                     )
//                                                 },
//                                             )}{' '}
//                                             - Profesores:{' '}
//                                             {timeslot.classTeachers.map(
//                                                 (classTeacher, index) => {
//                                                     return (
//                                                         <span key={index}>
//                                                             {
//                                                                 classTeacher
//                                                                     .teacher
//                                                                     ?.name
//                                                             }
//                                                         </span>
//                                                     )
//                                                 },
//                                             )}
//                                         </p>
//                                     )
//                                 })}
//                             </div>
//                         )
//                     })}
//                     {/* <button onClick={addTeacher}>Agregar profesor</button>
//                     <button onClick={() => removeTeacher(teacher)}>Eliminar</button> */}
//                 </div>
//             </form>
//         </div>
//     )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { ChevronRight, ChevronDown } from 'lucide-react'

// Types for our schedule data
interface TimeSlot {
    time: string
    students: string[]
    professors: string[]
}

interface DaySchedule {
    day: string
    timeSlots: TimeSlot[]
}

// Mock data for schedules
const mockScheduleData: DaySchedule[] = [
    {
        day: 'Lunes',
        timeSlots: [
            {
                time: '08:00:00',
                students: [
                    'First Student Name',
                    'Second Student Name',
                    'Third Student Name',
                ],
                professors: [],
            },
            {
                time: '09:00:00',
                students: [
                    'First Student Name',
                    'Second Student Name',
                    'Third Student Name',
                ],
                professors: [],
            },
            {
                time: '10:00:00',
                students: ['First Student Name'],
                professors: [],
            },
            {
                time: '11:00:00',
                students: [],
                professors: [],
            },
            {
                time: '12:00:00',
                students: [],
                professors: [],
            },
        ],
    },
    {
        day: 'Martes',
        timeSlots: [
            {
                time: '08:00:00',
                students: ['Maria González', 'Juan Pérez'],
                professors: ['Prof. Rodriguez'],
            },
            {
                time: '09:00:00',
                students: ['Ana López', 'Carlos Sánchez'],
                professors: ['Prof. Martinez'],
            },
        ],
    },
    {
        day: 'Miércoles',
        timeSlots: [
            {
                time: '10:00:00',
                students: ['Laura Díaz', 'Pedro Fernández'],
                professors: ['Prof. Gómez'],
            },
            {
                time: '11:00:00',
                students: ['Sofia Ruiz'],
                professors: ['Prof. Hernández'],
            },
        ],
    },
    {
        day: 'Jueves',
        timeSlots: [
            {
                time: '09:00:00',
                students: ['Miguel Torres', 'Isabel Vargas'],
                professors: ['Prof. López'],
            },
            {
                time: '10:00:00',
                students: ['Roberto Mendoza'],
                professors: ['Prof. Sánchez'],
            },
        ],
    },
    {
        day: 'Viernes',
        timeSlots: [
            {
                time: '08:00:00',
                students: ['Carmen Ortiz', 'Daniel Morales'],
                professors: ['Prof. Flores'],
            },
            {
                time: '12:00:00',
                students: ['Elena Castro'],
                professors: ['Prof. Ramírez'],
            },
        ],
    },
]

export default function AdminSchedulePanel() {
    const [scheduleData, setScheduleData] = useState<DaySchedule[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false)

    // Fetch schedule data
    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800))

                if (isMounted) {
                    setScheduleData(mockScheduleData)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los horarios')
                    console.error(err)
                }
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        fetchData()

        return () => {
            isMounted = false
        }
    }, [])

    // Handle day selection
    const handleDayClick = (day: string) => {
        if (selectedDay === day) {
            // If clicking the same day, toggle the panel
            setIsPanelOpen(!isPanelOpen)
        } else {
            // If clicking a different day, select it and open the panel
            setSelectedDay(day)
            setIsPanelOpen(true)
        }
    }

    // Get the selected day's schedule
    const getSelectedDaySchedule = () => {
        return scheduleData.find(schedule => schedule.day === selectedDay)
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4">
            {/* Main container with responsive behavior */}
            <div
                className={`relative z-10 flex flex-col md:flex-row w-full max-w-4xl transition-all duration-300 ease-in-out
        ${isPanelOpen ? 'md:space-x-4' : 'md:space-x-0'}`}>
                {/* Days panel - always visible but shifts left when detail panel opens */}
                <div
                    className={`bg-white/80 dark:bg-transparent  backdrop-blur shadow-lg rounded-lg border border-opacity-50 overflow-hidden
          transition-all duration-300 ease-in-out
          ${isPanelOpen ? 'md:w-1/3' : 'w-full'}`}>
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500 py-16">
                            {error}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {scheduleData.map(schedule => (
                                <button
                                    key={schedule.day}
                                    onClick={() => handleDayClick(schedule.day)}
                                    className={`w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                    ${
                        selectedDay === schedule.day
                            ? 'bg-gray-100 dark:bg-gray-800/50'
                            : ''
                    }`}>
                                    <span className="font-medium">
                                        {schedule.day}
                                    </span>
                                    {selectedDay === schedule.day &&
                                    isPanelOpen ? (
                                        <ChevronDown className="h-5 w-5 text-dark" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5 text-dark" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail panel - only visible when a day is selected */}
                {isPanelOpen && (
                    <div
                        className={`bg-white/80 dark:bg-transparent backdrop-blur shadow-lg rounded-lg border border-opacity-50 overflow-hidden
            mt-4 md:mt-0 transition-all duration-300 ease-in-out md:w-2/3`}>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">
                                Horarios
                            </h2>

                            {selectedDay && getSelectedDaySchedule() ? (
                                <div className="space-y-6">
                                    {getSelectedDaySchedule()?.timeSlots.map(
                                        (slot, index) => (
                                            <div
                                                key={index}
                                                className="space-y-2">
                                                <h3 className="font-medium text-purple-700 dark:text-purple-400">
                                                    {slot.time}
                                                </h3>

                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Estudiantes:
                                                    </p>
                                                    {slot.students.length >
                                                    0 ? (
                                                        <ul className="pl-4">
                                                            {slot.students.map(
                                                                (
                                                                    student,
                                                                    idx,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="text-gray-800 dark:text-gray-200">
                                                                        {
                                                                            student
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500 dark:text-gray-400 italic">
                                                            - Sin estudiantes -
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Profesores:
                                                    </p>
                                                    {slot.professors.length >
                                                    0 ? (
                                                        <ul className="pl-4">
                                                            {slot.professors.map(
                                                                (
                                                                    professor,
                                                                    idx,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="text-gray-800 dark:text-gray-200">
                                                                        {
                                                                            professor
                                                                        }
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-500 dark:text-gray-400 italic">
                                                            - Sin profesores -
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                    Selecciona un día para ver los horarios
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
