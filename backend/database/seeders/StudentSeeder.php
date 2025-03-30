<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Student::create([
            'name' => 'First Student Name',
            'last_name' => 'First Student Last Name',
            'registration_date' => now(),
            'email' => 'firststudent@example.com',
            'phone' => 'First Student Phone (+573123456789)',
            'dni' => 'First Student DNI (123456789)',
        ]);
        Student::create([
            'name' => 'Second Student Name',
            'last_name' => 'Second Student Last Name',
            'registration_date' => now(),
            'email' => 'secondstudent@example.com',
            'phone' => 'Second Student Phone (+573123456789)',
            'dni' => 'Second Student DNI (987654321)',
        ]);
        Student::create([
            'name' => 'Third Student Name',
            'last_name' => 'Third Student Last Name',
            'registration_date' => now(),
            'email' => 'thirdstudent@example.com',
            'phone' => 'Third Student Phone (+573123456789)',
            'dni' => 'Third Student DNI (123987456)',
        ]);
    }
}
