<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log as FacadesLog;

class ClassScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $selectedDays = $this->schedule->days;
        $timeslots = $this->timeslots()->orderBy('hour')->get();
        try {
            $timeslotStartTime = Carbon::parse($timeslots->first()->hour)->format('H:i');
            $timeslotEndTime = Carbon::parse($timeslots->last()->hour)->format('H:i');
        } catch (\Throwable $th) {
            $timeslotStartTime = null;
            $timeslotEndTime = null;
        }

        $teachers = $this->whenLoaded('teachers');
        $teachersArray = [];
        if ($teachers instanceof \Illuminate\Http\Resources\MissingValue) {
            $teachers = [];
        } else {
            $timeslots = $this->classScheduleTimeslots;
            if (!$timeslots instanceof \Illuminate\Http\Resources\MissingValue || $timeslots != null) {
                foreach ($timeslots as $timeslot) {
                    $teachers = $timeslot->classTeachers;
                    foreach($teachers as $teacher) {
                        array_push($teachersArray, $teacher);
                    }
                }
            }
        }

        $students = $this->whenLoaded('students');
        $studentsArray = [];
        if ($students instanceof \Illuminate\Http\Resources\MissingValue) {
            $students = [];
        } else {
            $timeslots = $this->classScheduleTimeslots;
            if (!$timeslots instanceof \Illuminate\Http\Resources\MissingValue || $timeslots != null) {
                foreach ($timeslots as $timeslot) {
                    $students = $timeslot->classStudents;
                    foreach($students as $student) {
                        array_push($studentsArray, $student);
                    }
                }
            }
        }
        return [
            'id' => $this->id,
            'class' => [
                'id' => $this->class->id,
                'name' => $this->class->plan->name,
                'branch_id' => $this->class->branch->id,
                'branch_name' => $this->class->branch->name,
            ],
            'schedule' => new ScheduleResource($this->whenLoaded('schedule')),
            'selectedDays' => $selectedDays,
            'time_start' => $timeslotStartTime,
            'time_end' => $timeslotEndTime,
            'timeslots' => ClassScheduleTimeslotResource::collection($this->whenLoaded('classScheduleTimeslots')),
            'students' => $studentsArray,
            'teachers' => $teachersArray,
        ];
    }
}
