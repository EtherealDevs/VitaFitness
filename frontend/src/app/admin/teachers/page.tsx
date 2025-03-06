"use client";
import { useState, useEffect, useMemo } from "react";
import { useTeachers } from "@/hooks/teachers";
import { useTeacherSchedules } from "@/hooks/teacherSchedules";
import { useBranches } from "@/hooks/branches";
import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function TeacherIndex()
    {
    // Fetch data from Teacher API
    const [teachers, setTeachers] = useState<any>([]);
    const [teacherSchedules, setTeacherSchedules] = useState<any>([]);
    const [branches, setBranches] = useState<any>([]);
    let [isOpen, setIsOpen] = useState(false);
    let [scheduleModalIsOpen, setScheduleModalIsOpen] = useState(false);
    const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = useTeachers();
    const { getTeacherSchedules, updateTeacherSchedule, deleteTeacherSchedule } = useTeacherSchedules();
    const { getBranches } = useBranches();

    function open(){
        setIsOpen(true);
    }
    function close() {
        setIsOpen(false);
    }
    function openScheduleModal()
    {
        setScheduleModalIsOpen(true);
    }
    function closeScheduleModal() {
        setScheduleModalIsOpen(false);
    }
    
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
        try {
          const response = await getBranches();
          setBranches(response.branches);
        } catch (error) {
          console.error(error);
          throw error;
        }
      };
      async function handleUpdateTeacherForm(e: React.FormEvent<HTMLFormElement>)
      {
        e.preventDefault();
        var formData = new FormData(e.target);
        await updateTeacher(e.target.id.value, formData);
      }
      async function handleUpdateTeacherSchedulesForm(e: React.FormEvent<HTMLFormElement>)
      {
        e.preventDefault();
        var formData = new FormData(e.target);
        await updateTeacherSchedule(e.target.id.value, formData);
      }
    function populateTeachersTable()
    {
        if (teachers?.length > 0) {
        let rows = teachers.map((teacher) => (
            <tr key={teacher.id}>
                <td>{teacher.id}</td>
                <td>{teacher.name}</td>
                <td>{teacher.last_name}</td>
                <td>{teacher.email}</td>
                <td>{teacher.phone}</td>
                <td>{teacher.dni}</td>
                <td>{teacher.branch?.name}</td>
                <td><Button key={1} onClick={() => populateUpdateTeacherForm(teacher.id)}>Editar</Button> - <Button onClick={() => handleDeleteTeacher(teacher.id)}>Borrar</Button></td>
            </tr>
        ));
        return rows;
        }
    }
    function mapBranches()
    {
        if (branches?.length > 0) {
        let rows = branches.map((branch) => (
            
                <option value={branch.id}>{branch.name}</option>
            
        ));
        return rows;
        }
    }
    function mapTeachers()
    {
        if (teachers?.length > 0) {
        let rows = teachers.map((teacher) => (
            
                <option value={teacher.id}>{teacher.name}</option>
            
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
                    return
                }
            });
            var form = document.getElementById('updateTeacherForm');
            if (form) {
                var elements = form?.elements;
                elements.id.value = teacher.id;
                elements.name.value = teacher.name;
                elements.last_name.value = teacher.last_name;
                elements.email.value = teacher.email;
                elements.phone.value = teacher.phone;
                elements.dni.value = teacher.dni;
                elements.branch_id.value = teacher.branch.id;
            }
            console.log(elements);
            open();
    
        }
    }
    function populateUpdateTeacherSchedulesForm(id: number)
    {
        if (teacherSchedules?.length > 0) {
            var schedule: any;
            teacherSchedules.forEach(element => {
                if (element.id === id) {
                    schedule = element;
                }
            });
            var form = document.getElementById('updateTeacherSchedulesForm');
            if (form) {
                var elements = form?.elements;
                elements.id.value = schedule.id;
                elements.start_time.value = schedule.start_time;
                elements.end_time.value = schedule.end_time;
                elements.day.value = schedule.day;
                elements.teacher_id.value = schedule.teacher.id;
            }
            console.log(elements);
            openScheduleModal();
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
                    <td><Button key={3} onClick={() => populateUpdateTeacherSchedulesForm(schedule.id)}>Editar</Button> - <Button onClick={() => handleDeleteTeacherSchedule(schedule.id)}>Borrar</Button></td>
                </tr>
            ));
            return rows;
            }
    }
    async function handleDeleteTeacher(id: number)
    {
        const confirmDelete = confirm(
            "¿Estás seguro de que deseas eliminar este profesor?"
          );
          if (!confirmDelete) return;
      
          try {
            await deleteTeacher(String(id));
            alert("Profesor eliminado correctamente");
            setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher.id !== id));
          } catch (error) {
            console.error("Error al eliminar el profesor:", error);
            alert("No se pudo eliminar el profesor");
          }

    }
    async function handleDeleteTeacherSchedule(id: number)
    {
        const confirmDelete = confirm(
            "¿Estás seguro de que deseas eliminar este horario?"
          );
          if (!confirmDelete) return;
      
          try {
            await deleteTeacherSchedule(String(id));
            alert("Horario eliminado correctamente");
            setTeacherSchedules((prevTeacherSchedules) => prevTeacherSchedules.filter((teacherSchedule) => teacherSchedule.id !== id));
          } catch (error) {
            console.error("Error al eliminar el horario:", error);
            alert("No se pudo eliminar el horario");
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
    {/* Modal va acá --- Este es para teachers, usa variable isOpen y las funciones son open y close */}
    <form id="updateTeacherForm" className="" onSubmit={handleUpdateTeacherForm}>
        <input type="hidden" name="id" />
        <input type="text" name="name" placeholder="Nombre" />
        <input type="text" name="last_name" placeholder="Apellido" />
        <input type="email" name="email" placeholder="Email" />
        <input type="text" name="phone" placeholder="Teléfono" />
        <input type="text" name="dni" placeholder="DNI" />
        <select name="branch_id">
            <option value="null">Seleccione una sucursal</option>
            {mapBranches()}
        </select>
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
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {/* Populate table rows with fetched data */}
            
            {populateSchedulesTable()}

        </tbody>

    </table>
    {/* Modal va acá --- Este es para horarios, usa variable scheduleModalIsOpen y las funciones son scheduleModalOpen y scheduleModalClose */}
    <form id="updateTeacherSchedulesForm" className="" onSubmit={handleUpdateTeacherSchedulesForm}>
        <input type="hidden" name="id" />
        <input type="time" name="start_time" placeholder="Horario de Inicio" />
        <input type="time" name="end_time" placeholder="Horario de finalizacion" />
        <input type="text" name="day" placeholder="Dia" />
        <select name="teacher_id">
            <option value="null">Seleccione un profesor</option>
            {mapTeachers()}
        </select>
        <button type="submit">Actualizar</button>
    </form>
    </div>
    );
}