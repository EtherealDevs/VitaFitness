<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassScheduleTimeslotStudentResource extends JsonResource
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
            'student' => $this->student,
            'scheduleTimeslot' => $this->scheduleTimeslot,
            'hour' => $this->timeslot->hour,
            'timeslot' => new TimeslotResource($this->whenloaded('timeslot')),
            'attendances' => AttendanceResource::collection($this->whenLoaded('attendances')),
        ];
    }
}