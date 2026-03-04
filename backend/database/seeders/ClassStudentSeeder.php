<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = Classe::all();
        foreach ($classes as $class) {
            $students = Student::all();
            foreach ($students as $student) {
                $class->students()->attach($student->id);
            }
        }
    }
}
