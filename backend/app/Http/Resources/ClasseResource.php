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
        
        $schedule = $this->whenLoaded('schedule');
        $schedule_name = null;
        $schedule_id = null;
        if ($schedule instanceof \Illuminate\Http\Resources\MissingValue) {
            $schedule = null;
        } else {
            $schedule_name = $schedule->day;
            $schedule_id = $schedule->id;
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

        return [
            'id' => $this->id,
            'class_id' => $this->id,
            'max_students' => $this->max_students,
            'schedule_day' => $schedule_name,
            'precio' => $this->precio,
            'class_price' => $this->precio,
            'branch_id' => $branch_id,
            'branch_name' => $branch_name,
            'plan_id' => $plan_id,
            'plan_name' => $plan_name,
            'plan_status' => $plan_status,
            'timeslot_id' => $this->timeslot_id,
            'schedule_id' => $this->schedule_id,
            'branch' => new BranchResource($this->branch),
            'plan' => new PlanResource($this->plan),
            'timeslot' => new TimeSlotResource($this->timeslot),
            'schedule' => new ScheduleResource($this->schedule),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}
