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
        $branches = Branch::all();
        $plans = Plan::all();
        $schedules = Schedule::latest()->take(2)->get();
        $timeslots = TimeSlot::latest()->take(4)->get();
        
        foreach ($branches as $branch) {
            foreach ($plans as $plan) {
                foreach ($schedules as $schedule) {
                    foreach ($timeslots as $timeslot) {
                        Classe::create([
                            'branch_id' => $branch->id,
                            'plan_id' => $plan->id,
                            'schedule_id' => $schedule->id,
                            'timeslot_id' => $timeslot->id,
                            'precio' => rand(100, 1000),
                            'max_students' => rand(1, 10),
                        ]);
                    }
                }
            }
        }
    }
}
