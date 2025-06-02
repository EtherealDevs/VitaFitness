'use client'

import { useState, useEffect, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useClasses } from '@/hooks/classes'
import { useStudents } from '@/hooks/students'
import { useTeachers } from '@/hooks/teachers'
import { useClassSchedules } from '@/hooks/classSchedules'
import { useClassStudents } from '@/hooks/classStudents'
import { useClassTeachers } from '@/hooks/classTeachers'
import { useParams } from 'next/navigation'
import { Button } from '@/app/admin/components/ui/button'

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Label from '@/components/ui/Label';
import { Trash2, Pencil, UserPlus, UserMinus } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';


// Types for our student data
interface Teacher {
    id: string
    name: string
    last_name: string
    email: string
    phone: string
    dni: string
    created_at: string
    updated_at: string
}
interface Student {
    id: string
    name: string
    last_name: string
    phone: string
    dni: string
    registration_date: string
    status: 'activo' | 'inactivo' | 'pendiente'
}
interface Timeslot {
    id: string
    hour: string
}
interface Schedule {
    id: number
    days: string[]
}
interface ClassSchedule {
    id: string
    class: {id: string, name: string, branch_id: string, branch_name: string}
    schedule: Schedule
    selectedDays: string[]
    timeslots: Timeslot[]
    students: Student[]
    teachers: Teacher[]
}

export default function AdminClassDetails() {
    const router = useRouter()
    const { id } = useParams()
    const params = { id: id as string }

    const [schedule, setSchedule] = useState<ClassSchedule>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedDay] = useState<string | null>(null)
    const [isPanelOpen] = useState<boolean>(false)
    const [expandedTimeSlots, setExpandedTimeSlots] = useState<
        Record<string, boolean>
    >({})
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false)
    const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false)
    const [isTimeslotModalOpen, setIsTimeslotModalOpen] =
        useState<boolean>(false)

    const [studentModal, setStudentModal] = useState<string | null>(null);
    const [teacherModal, setTeacherModal] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

    const [allStudents, setAllStudents] = useState<Student[]>([]);
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);

    const { getClassSchedule } = useClassSchedules()
    const { createClassTeacher, updateClassTeacher, deleteClassTeacher } = useClassTeachers()
    const { getStudents } = useStudents()
    const { getTeachers } = useTeachers()

    // Fetch class data
    useEffect(() => {
        let isMounted = true

        const fetchData = async () => {
            if (!isMounted) return

            setLoading(true)
            setError(null)

            try {
                const res = await getClassSchedule(params.id)
                const students = await getStudents()
                const teachers = await getTeachers()

                if (isMounted) {
                    setSchedule(res.classSchedule)
                    setAllStudents(students.students)
                    setAllTeachers(teachers.teachers)
                }
            } catch (err) {
                if (isMounted) {
                    setError('Error al cargar los datos de la clase')
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
    }, [getClassSchedule, params.id])
    
    const onEdit = (id: string) => {
        router.push(`/admin/classes/edit/${id}`)
    }
    const onDelete = (id: string) => {
        alert('Esta seguro de que desea eliminar esta clase?')
    }
    const onAddStudent = (id: string, students: string[]) => {
        alert('Esta seguro de que desea agregar estudiantes?')
    }
    const onRemoveStudent = (id: string, studentId: string) => {
        alert('Esta seguro de que desea eliminar estudiantes?')
    }
    const onAddTeacher = async (id: string, teachers: string[]) => {
        // Turn an array of teacher IDs into formData
        const formData = new FormData()
        teachers.forEach(teacherId => {
            formData.append('teachers[]', teacherId)
        })
        formData.append('c_sch_ts_id', id)

        // Send the formData to the backend
        const res = await createClassTeacher(formData)
        console.log(res)

        alert('Esta seguro de que desea agregar profesores?')
    }
    const onRemoveTeacher = (id: string, teacherId: string) => {
        alert('Esta seguro de que desea eliminar profesores?')
    }

    

  const handleAddStudents = () => {
    if (studentModal && onAddStudent) {
      onAddStudent(studentModal, selectedStudents);
    }
    setStudentModal(null);
    setSelectedStudents([]);
  };

  const handleAddTeachers = () => {
    if (teacherModal && onAddTeacher) {
      onAddTeacher(teacherModal, selectedTeachers);
    }
    setTeacherModal(null);
    setSelectedTeachers([]);
  };

    if (!schedule) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No se encontraron clases
            </div>
        )
    }
    return (
    <div className="grid gap-6 p-4">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Clase: {schedule.class.name} | {schedule.class.branch_name}</h2>
                <p className="text-sm text-gray-500">ID: {schedule.id}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => onEdit(schedule.id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => onDelete(schedule.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-2">
              <strong>Días seleccionados:</strong> {schedule.selectedDays.join(', ')}
            </div>

            <div className="mb-2">
              <strong>Horario:</strong> {schedule.schedule.days.join(', ')}
            </div>

            <div className="mb-2">
              <strong>Timeslots:</strong> {schedule.timeslots.map(t => t.hour).join(', ')}
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-center">
                <strong>Estudiantes:</strong>
                <Button variant="outline" size="sm" onClick={() => setStudentModal(schedule.id)}>
                  <UserPlus className="w-4 h-4 mr-1" /> Agregar Estudiante
                </Button>
              </div>
              <ul className="list-disc list-inside">
                {schedule.students.map(student => (
                  <li key={student.id} className="flex justify-between items-center">
                    {student.name} {student.last_name} ({student.status})
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveStudent?.(schedule.id, student.id)}
                    >
                      <UserMinus className="w-4 h-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-2">
              <div className="flex justify-between items-center">
                <strong>Profesores:</strong>
                <Button variant="outline" size="sm" onClick={() => setTeacherModal(schedule.id)}>
                  <UserPlus className="w-4 h-4 mr-1" /> Agregar Profesor
                </Button>
              </div>
              <ul className="list-disc list-inside">
                {schedule.teachers.map(teacher => (
                  <li key={teacher.id} className="flex justify-between items-center">
                    {teacher.name} {teacher.last_name} - {teacher.email}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveTeacher?.(schedule.id, teacher.id)}
                    >
                      <UserMinus className="w-4 h-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

      <Dialog open={!!studentModal} onOpenChange={() => setStudentModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Estudiantes</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <select
              multiple
              className="border rounded p-2"
              value={selectedStudents}
              onChange={(e) =>
                setSelectedStudents(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.last_name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddStudents}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!teacherModal} onOpenChange={() => setTeacherModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Profesores</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <select
              multiple
              className="border rounded p-2"
              value={selectedTeachers}
              onChange={(e) =>
                setSelectedTeachers(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {allTeachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} {t.last_name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button onClick={handleAddTeachers}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    );


}