<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Classe;
use App\Models\ClassScheduleTimeslot;
use App\Models\ClassScheduleTimeslotStudent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classScheduleTimeslots = ClassScheduleTimeslot::all();
        $timeslot1 = $classScheduleTimeslots[0];
        foreach ($timeslot1->students as $student) {
            $timeslotStudent = ClassScheduleTimeslotStudent::where('c_sch_ts_id', $timeslot1->id)
            ->where('student_id', $student->id)
            ->first();
            $timeslotStudent->attendances()->create([
                'date' => now(),
                'status' => 'presente',
            ]);
        }
        // $timeslot1->attendances()->create([
        //     'date' => now(),
        //     'status' => 'presente',
        // ]);
        // $timeslot2 = $classScheduleTimeslots[1];
        // $timeslot2->attendances()->create([
        //     'date' => now(),
        //     'status' => 'presente',
        // ]);
        // $timeslot3 = $classScheduleTimeslots[2];
        // $timeslot3->attendances()->create([
        //     'date' => now(),
        //     'status' => 'presente',
        // ]);
    }
}
