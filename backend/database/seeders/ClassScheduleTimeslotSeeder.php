<?php

namespace Database\Seeders;

use App\Models\ClassSchedule;
use App\Models\Schedule;
use App\Models\ScheduleTimeslot;
use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassScheduleTimeslotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $timeslots = TimeSlot::all();
        $classSchedules = ClassSchedule::all();
        $classSchedule1 = $classSchedules[0];
        $classSchedule2 = $classSchedules[1];

        foreach ($timeslots as $timeslot) {
            $timeslot->schedules()->attach($classSchedule1);
        }
        foreach ($timeslots as $timeslot) {
            $classSchedule2->timeslots()->syncWithoutDetaching($timeslot);
        }

    }
}
