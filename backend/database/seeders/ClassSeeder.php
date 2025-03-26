<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Classe;
use App\Models\Plan;
use App\Models\Schedule;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branch1 = Branch::all()[0];
        $branch2 = Branch::all()[1];
        $plan1 = Plan::all()[0];
        $plan2 = Plan::all()[1];
        $plan3 = Plan::all()[2];
        $schedule1 = Schedule::all()[0];
        $schedule2 = Schedule::all()[1];
        $schedule3 = Schedule::all()[2];
        $schedule4 = Schedule::all()[3];
        $timeslot1 = TimeSlot::all()[0];
        $student1 = Student::all()[0];
        $student2 = Student::all()[1];
        $teacher1 = Teacher::all()[0];
        $teacher2 = Teacher::all()[1];
        $teacher3 = Teacher::all()[2];

        Classe::create([
            'branch_id' => $branch1->id,
            'plan_id' => $plan1->id,
            'schedule_id' => $schedule1->id,
            'timeslot_id' => $timeslot1->id,
            'student_id' => $student1->id,
            'teacher_id' => $teacher1->id,
            'max_students' => 3
        ]);
        Classe::create([
            'branch_id' => $branch1->id,
            'plan_id' => $plan1->id,
            'schedule_id' => $schedule1->id,
            'timeslot_id' => $timeslot1->id,
            'student_id' => $student2->id,
            'teacher_id' => $teacher1->id,
            'max_students' => 3
        ]);
    }
}
