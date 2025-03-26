<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Classe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $class1 = Classe::all()[0];
        $class2 = Classe::all()[1];
        Attendance::create([
            'class_id' => $class1->id,
            'date' => now(),
            'status' => 'presente',
        ]);
    }
}
