<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\Schedule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = Classe::all();
        $schedules = Schedule::all();

        $class1 = $classes[0];
        $class2 = $classes[1];
        $schedule1 = $schedules[0];
        $schedule2 = $schedules[1];
        
        $class1->schedules()->attach($schedule1);
        $class1->schedules()->attach($schedule2);

        $schedule1->classes()->attach($class2);
        $schedule2->classes()->attach($class2);
    }
}
