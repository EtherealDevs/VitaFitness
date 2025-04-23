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
            'branch' => new BranchResource($this->branch),
            'plan' => new PlanResource($this->plan),
            'schedules' => ClassScheduleResource::collection($this->whenLoaded('classSchedules')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}
