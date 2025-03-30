<?php

namespace Database\Seeders;

use App\Models\ClassScheduleTimeslot;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassScheduleTimeslotStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        $classScheduleTimeslots = ClassScheduleTimeslot::all();
        $classScheduleTimeslot1 = $classScheduleTimeslots[0];
        $classScheduleTimeslot2 = $classScheduleTimeslots[1];
        $classScheduleTimeslot3 = $classScheduleTimeslots[2];

        foreach ($students as $student) {
            $classScheduleTimeslot1->students()->attach($student);
        }
        foreach ($students as $student) {
            $student->timeslots()->syncWithoutDetaching($classScheduleTimeslot1);
            $student->timeslots()->syncWithoutDetaching($classScheduleTimeslot2);
        }
        $loop = 0;
        foreach ($students as $student) {
            if ($loop < 1) {
            $student->timeslots()->syncWithoutDetaching($classScheduleTimeslot3);
            }
            $loop++;
        }
    }
}
