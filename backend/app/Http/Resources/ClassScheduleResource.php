<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            dd($selectedDays, $timeslots, $this, $th);
        }
        return [
            'id' => $this->id,
            'class' => new ClasseResource($this->class),
            'schedule' => new ScheduleResource($this->schedule),
            'selectedDays' => $selectedDays,
            'time_start' => $timeslotStartTime,
            'time_end' => $timeslotEndTime,
        ];
    }
}