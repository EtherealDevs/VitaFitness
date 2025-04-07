<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Teacher;
use App\Models\Classe;
use Illuminate\Http\JsonResponse;

class StatisticsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'students_per_plan' => $this->studentsPerPlan(),
            'students_per_teacher' => $this->studentsPerTeacher(),
            'students_per_class' => $this->studentsPerClass(),
        ]);
    }

    protected function studentsPerPlan(): array
    {
        return Plan::withCount(['classes as students_count' => function ($query) {
            $query->withCount(['classSchedules as schedules_count' => function ($q) {
                $q->withCount('classScheduleTimeslots as timeslot_count');
            }]);
        }])->get()->mapWithKeys(function ($plan) {
            $studentsCount = $plan->classes->flatMap(function ($class) {
                return $class->classSchedules->flatMap(function ($schedule) {
                    return $schedule->classScheduleTimeslots->flatMap(function ($timeslot) {
                        return $timeslot->students->pluck('id');
                    });
                });
            })->unique()->count();

            return [$plan->name => $studentsCount];
        })->toArray();
    }

    protected function studentsPerTeacher(): array
    {
        return Teacher::with('timeslots.students')->get()->mapWithKeys(function ($teacher) {
            $students = $teacher->timeslots->flatMap(function ($slot) {
                return $slot->students->pluck('id');
            })->unique();

            return [$teacher->name . ' ' . $teacher->last_name => $students->count()];
        })->toArray();
    }

    public function studentsPerClass()
    {
        $classes = Classe::with([
            'plan:id,name',
            'classSchedules.classScheduleTimeslots.students',
            'schedules.timeslots' => function ($query) {
                $query->select('timeslots.id', 'hour');
            },
        ])->get();

        $data = $classes->map(function ($class) {
            $studentsCount = $class->classSchedules
                ->flatMap(fn($schedule) => $schedule->classScheduleTimeslots)
                ->flatMap(fn($timeslot) => $timeslot->students)
                ->unique('id')
                ->count();

            // Recolectar horarios
            $days = $class->schedules->pluck('days')->flatten()->unique();
            $times = $class->schedules->flatMap->timeslots->map(function ($slot) {
                return $slot->hour;
            })->unique();

            return [
                'class_id' => $class->id,
                'plan' => $class->plan?->name,
                'students_count' => $studentsCount,
                'days' => $days,
                'times' => $times,
            ];
        });

        return [
            'classes' => $data,
        ];
    }
}
