<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $branch = $this->whenLoaded('branch');
        $branch_name = null;
        $branch_id = null;
        if ($branch instanceof \Illuminate\Http\Resources\MissingValue) {
            $branch = null;
        } else {
            $branch_name = $branch->name;
            $branch_id = $branch->id;
        }

        $plan = $this->whenLoaded('plan');
        $plan_name = null;
        $plan_id = null;
        $plan_status = null;
        if ($plan instanceof \Illuminate\Http\Resources\MissingValue) {
            $plan = null;
        } else {
            $plan_name = $plan->name;
            $plan_id = $plan->id;
            $plan_status = $plan->status;
        }

        $classSchedules = $this->whenLoaded('classSchedules');
        if ($classSchedules instanceof \Illuminate\Http\Resources\MissingValue) {
            $classSchedules = [];
        } else {
            $array = [];
            foreach ($classSchedules as $classSchedule) {
                $schedule = $classSchedule->schedule;
                foreach ($classSchedule->classScheduleTimeslots as $classScheduleTimeslot) {
                    $timeslot = $classScheduleTimeslot->timeslot;
                    $newArray = [
                        'class_id' => $classSchedule->class->id,
                        'schedule_id' => $schedule->id,
                        'classSchedule_id' => $classSchedule->id,
                        'timeslot_id' => $timeslot->id,
                        'classScheduleTimeslot_id' => $classScheduleTimeslot->id,
                        'schedule_days' => $schedule->days,
                        'timeslot_hour' => $timeslot->hour,
                    ];
                    array_push($array, $newArray);
                }
            }
            $classSchedules = $array;
        }

        return [
            'id' => $this->id,
            'class_id' => $this->id,
            'max_students' => $this->max_students,
            'precio' => $this->precio,
            'branch_id' => $branch_id,
            'branch_name' => $branch_name,
            'plan_id' => $plan_id,
            'plan_name' => $plan_name,
            'plan_status' => $plan_status,
            'branch' => new BranchResource($this->branch),
            'plan' => new PlanResource($this->plan),
            'schedules' => $classSchedules,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}
