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
        // $schedules = null;

        // if ($this->schedules)
        // {

        //     $schedules = TeacherSchedulesResource::collection($this->whenLoaded('schedules'));
        // }
        // $classes = $this->whenLoaded('classes');
        // if ($classes instanceof \Illuminate\Http\Resources\MissingValue) {
        //     $classes = [];
        // } else {
        //     $classes = $classes->map(function ($class) {
        //         $plan = $class->plan;
        //         return ['class_id' => $class->id, 'plan' => ['plan_id' => $plan->id, 'name' => $plan->name]];
        //     });
        // }
        // $timeslots = $this->whenLoaded('timeslots');
        // if ($timeslots instanceof \Illuminate\Http\Resources\MissingValue) {
        //     $timeslots = [];
        // } else {
        //     $timeslots = $timeslots->map(function ($class_schedule_timeslot) {
        //         // $timeslot = $timeslot->timeslot;
        //         return ['class_schedule_id' => $class_schedule_timeslot->classSchedule->id, 'class_schedule_timeslot_id' => $class_schedule_timeslot->id, 'timeslot_id' => $class_schedule_timeslot->timeslot->id, 'hour' => $class_schedule_timeslot->timeslot->hour];
        //     });
        // }
        // $classSchedules = $this->whenLoaded('classSchedules');
        // if ($classSchedules instanceof \Illuminate\Http\Resources\MissingValue) {
        //     $classSchedules = [];
        // } else {
        //     $classSchedules = $classSchedules->map(function ($classSchedule) {
        //         return ['class_schedule_id' => $classSchedule->id, 'class_id' => $classSchedule->class->id, 'schedule_id' => $classSchedule->schedule->id, 'days' => $classSchedule->schedule->days];
        //     });
        // }
        $classScheduleTimeslotTeachers = $this->whenLoaded('classScheduleTimeslotTeachers');
        if ($classScheduleTimeslotTeachers instanceof \Illuminate\Http\Resources\MissingValue) {
            $classScheduleTimeslotTeachers = [];
        } else {
            $classScheduleTimeslotTeachers = $classScheduleTimeslotTeachers->map(function ($classScheduleTimeslotTeacher) {
                $schedule = $classScheduleTimeslotTeacher->scheduleTimeslot->schedule;
                $timeslot = $classScheduleTimeslotTeacher->scheduleTimeslot->timeslot;
                $array = [
                    'schedule_id' => $schedule->id,
                    'timeslot_id' => $timeslot->id,
                    'classScheduleTimeslot_id' => $classScheduleTimeslotTeacher->scheduleTimeslot->id,
                    'classScheduleTimeslotTeacher_id' => $classScheduleTimeslotTeacher->id,
                    'schedule_days' => $schedule->days,
                    'timeslot_hour' => $timeslot->hour
                ];
                return $array;
                // return ['class_schedule_timeslot_teacher_id' => $classScheduleTimeslotTeacher->id, 'schedule' => $schedule];
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
