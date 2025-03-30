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
        return [
            'id' => $this->id,
            'max_students' => $this->max_students,
            'precio' => $this->precio,
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'plan' => new PlanResource($this->whenLoaded('plan')),
            'schedules' => ScheduleResource::collection($this->whenLoaded('schedules')),
            // 'timeslot' => new TimeslotResource($this->whenLoaded('timeslot')),
            // 'teacher' => new TeacherResource($this->whenLoaded('teacher')),
            // 'student' => new StudentResource($this->whenLoaded('student')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}
