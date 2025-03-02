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
            'name' => 'Student Name',
            'last_name' => 'Student Last Name',
            'registration_date' => now(),
            'email' => 'student@example.com',
            'phone' => '+573123456789',
            'dni' => 'Student DNI (123456789)',
            'branch_id' => Branch::all()->random(1)->first()->id,
        ]);
    }
}
