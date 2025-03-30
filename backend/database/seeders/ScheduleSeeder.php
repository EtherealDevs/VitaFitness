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
        Schedule::create([
            'days' => ['lunes', 'martes', 'miercoles', 'jueves']
        ]);
        Schedule::create([
            'days' => ['viernes','sabado']
        ]);
        Schedule::create([
            'days' => ['domingo']
        ]);
        Schedule::create([
            'days' => ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
        ]);
    }
}
