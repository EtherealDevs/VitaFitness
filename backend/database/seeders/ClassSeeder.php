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

        Classe::create([
            'branch_id' => $branch1->id,
            'plan_id' => $plan1->id,
            'max_students' => 3,
            'precio' => 20000
        ]);
        Classe::create([
            'branch_id' => $branch1->id,
            'plan_id' => $plan2->id,
            'max_students' => 3,
            'precio' => 20000
        ]);
    }
}
