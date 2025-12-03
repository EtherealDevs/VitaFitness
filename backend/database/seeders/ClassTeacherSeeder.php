<?php

namespace Database\Seeders;

use App\Models\Classe;
use App\Models\Teacher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassTeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $classes = Classe::all();
        foreach ($classes as $class) {
            $teachers = Teacher::all();
            foreach ($teachers as $teacher) {
                $class->teachers()->attach($teacher->id);
            }
        }
    }
}
