"use client";
import { useState, useEffect, useMemo } from "react";
import { useTeachers } from "@/hooks/teachers";
import { useTeacherSchedules } from "@/hooks/teacherSchedules";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function TeacherIndex()
    {
    // Fetch data from Teacher API
    const [teachers, setTeachers] = useState<any>([]);
    const [teacherSchedules, setTeacherSchedules] = useState<any>([]);
    let [isOpen, setIsOpen] = useState(false)

    function open(){
        setIsOpen(true);
    }
    function close() {
        var form = document.getElementById('updateTeacherForm');
            if (form) {
                var elements = form?.elements;
                elements.id.value = "";
                elements.name.value = "";
                elements.last_name.value = "";
                elements.email.value = "";
                elements.phone.value = "";
                elements.dni.value = "";
            }
        setIsOpen(false);
    }
    const { getTeachers } = useTeachers();
    const { getTeacherSchedules } = useTeacherSchedules();
    const fetchData = async () => {
        try {
          const response = await getTeachers();
          setTeachers(response.teachers);
        } catch (error) {
          console.error(error);
          throw error;
        }
        try {
          const response = await getTeacherSchedules();
          setTeacherSchedules(response.teacher_schedules);
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
      function handleUpdateTeacherForm(e: React.FormEvent<HTMLFormElement>): void
      {
        e.preventDefault();
        // Update teacher data and re-fetch data

        return
      }
    function populateTeachersTable()
    {
        if (teachers?.length > 0) {
        JSON.stringify(teachers);
        let rows = teachers.map((teacher) => (
            // <form>
            <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.dni}</td>
                <td>{teacher.branch?.name}</td>
                <td><Button key={1} onClick={() => populateUpdateTeacherForm(teacher.id)}>Editar</Button></td>
            </tr>
            // </form>
        ));
        return rows;
        }
    }
    function populateUpdateTeacherForm(id: number)
    {
        if (teachers?.length > 0) {
            var teacher: any;
            teachers.forEach(element => {
                if (element.id === id) {
                    teacher = element;
                }
            });
            var form = document.getElementById('updateTeacherForm');
            if (form) {
                form.className = "";
                var elements = form?.elements;
                elements.id.value = teacher.id;
                elements.name.value = teacher.name;
                elements.last_name.value = teacher.last_name;
                elements.email.value = teacher.email;
                elements.phone.value = teacher.phone;
                elements.dni.value = teacher.dni;
            }
            open();
    
        }
    }
    function populateSchedulesTable()
    {
        if (teacherSchedules?.length > 0) {
            JSON.stringify(teacherSchedules);
            console.log(teacherSchedules);
            let rows = teacherSchedules.map((schedule) => (
                <tr key={schedule.id}>
                    <td>{schedule.id}</td>
                    <td>{schedule.teacher.name} {schedule.teacher.last_name}</td>
                    <td>{schedule.day}</td>
                    <td>{schedule.start_time}</td>
                    <td>{schedule.end_time}</td>
                </tr>
            ));
            return rows;
            }
    }
    useEffect(() => {
        fetchData();
      }, []);
      console.log(teachers);

    return (
    <div>
        <h1>
            Teacher Index
        </h1>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>DNI</th>
                <th>Sucursal</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {/* Populate table rows with fetched data */}
            
            {populateTeachersTable()}

        </tbody>

    </table>
    <form id="updateTeacherForm" className="">
        <input type="hidden" name="id" />
        <input type="text" name="name" placeholder="Nombre" />
        <input type="text" name="last_name" placeholder="Apellido" />
        <input type="text" name="email" placeholder="Email" />
        <input type="text" name="phone" placeholder="Teléfono" />
        <input type="text" name="dni" placeholder="DNI" />
        <button type="submit">Actualizar</button>
    </form>

    <h2>Horarios</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Profesor</th>
                <th>Día</th>
                <th>Horario de inicio</th>
                <th>Horario de finalizacion</th>
            </tr>
        </thead>
        <tbody>
            {/* Populate table rows with fetched data */}
            
            {populateSchedulesTable()}

        </tbody>

    </table>
    </div>
    );
}