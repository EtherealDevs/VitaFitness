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

        foreach ($classSchedules as $classSchedule) {
            $classSchedule->timeslots()->syncWithoutDetaching($timeslots);
        }

    }
}
