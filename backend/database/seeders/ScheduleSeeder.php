<?php

namespace Database\Seeders;

use App\Models\Schedule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // A sequence that creates a schedule for each day of the week
        $days = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
        foreach ($days as $day) {
            Schedule::create([
                'day' => $day,
            ]);
        }
    }
}
