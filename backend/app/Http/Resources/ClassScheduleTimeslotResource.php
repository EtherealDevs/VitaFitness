<?php

namespace App\Http\Resources;

use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassScheduleTimeslotResource extends JsonResource
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
            'hour' => $this->timeslot->hour,
            'classStudents' => ClassScheduleTimeslotStudentResource::collection($this->whenLoaded('classStudents')),
            'classTeachers' => ClassScheduleTimeslotTeacherResource::collection($this->whenLoaded('classTeachers')),
        ];
    }
}