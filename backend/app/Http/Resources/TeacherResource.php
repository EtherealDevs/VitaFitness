<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function Laravel\Prompts\error;

class TeacherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $classScheduleTimeslotTeachers = $this->whenLoaded('classScheduleTimeslotTeachers');
        if ($classScheduleTimeslotTeachers instanceof \Illuminate\Http\Resources\MissingValue) {
            $classScheduleTimeslotTeachers = [];
        } else {
            $classScheduleTimeslotTeachers = $classScheduleTimeslotTeachers->map(function ($classScheduleTimeslotTeacher) {
                $schedule = $classScheduleTimeslotTeacher->scheduleTimeslot->schedule;
                $timeslot = $classScheduleTimeslotTeacher->scheduleTimeslot->timeslot;
                $class = $classScheduleTimeslotTeacher->scheduleTimeslot->classSchedule->class;
                $array = [
                    'schedule_id' => $schedule->id,
                    'timeslot_id' => $timeslot->id,
                    'classScheduleTimeslot_id' => $classScheduleTimeslotTeacher->scheduleTimeslot->id,
                    'classScheduleTimeslotTeacher_id' => $classScheduleTimeslotTeacher->id,
                    'schedule_days' => $schedule->days,
                    'timeslot_hour' => $timeslot->hour,
                    'class_id' => $class->id,
                    'plan_id' => $class->plan->id,
                    'plan_name' => $class->plan->name
                ];
                return $array;
            });
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'dni' => $this->dni,
            // 'schedules' => $schedules,
            'schedules' => $classScheduleTimeslotTeachers,
            // 'classes' => $classes,
            // 'timeslots' => $timeslots,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
