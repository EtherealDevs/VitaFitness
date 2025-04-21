<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassScheduleTimeslotTeacherResource extends JsonResource
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
            'teacher' => $this->teacher,
            'timeslot' => new TimeslotResource($this->whenloaded('timeslot')),
            // 'scheduleTimeslot' => $this->timeslot,
        ];
    }
}