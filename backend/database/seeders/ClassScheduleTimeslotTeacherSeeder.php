<?php

namespace Database\Seeders;

use App\Models\ClassScheduleTimeslot;
use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassScheduleTimeslotTeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $teachers = Teacher::all();
        $classScheduleTimeslots = ClassScheduleTimeslot::all();
        $classScheduleTimeslot1 = $classScheduleTimeslots[0];
        $classScheduleTimeslot2 = $classScheduleTimeslots[1];
        $classScheduleTimeslot3 = $classScheduleTimeslots[2];

        foreach ($teachers as $teacher) {
            $classScheduleTimeslot1->teachers()->attach($teacher);
        }
        foreach ($teachers as $teacher) {
            $teacher->timeslots()->syncWithoutDetaching($classScheduleTimeslot1);
            $teacher->timeslots()->syncWithoutDetaching($classScheduleTimeslot2);
        }
        $loop = 0;
        foreach ($teachers as $teacher) {
            if ($loop < 1) {
            $teacher->timeslots()->syncWithoutDetaching($classScheduleTimeslot3);
            }
            $loop++;
        }
    }
}
