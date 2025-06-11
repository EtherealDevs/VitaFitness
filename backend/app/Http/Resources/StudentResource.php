<?php

namespace App\Http\Resources;

use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $classScheduleTimeslotStudents = $this->whenLoaded('classScheduleTimeslotStudents');
        if ($classScheduleTimeslotStudents instanceof \Illuminate\Http\Resources\MissingValue) {
            $classScheduleTimeslotStudents = [];
        } else {
            $classScheduleTimeslotStudents = $classScheduleTimeslotStudents->map(function ($classScheduleTimeslotStudent) {
                $schedule = $classScheduleTimeslotStudent->scheduleTimeslot->schedule;
                $timeslot = $classScheduleTimeslotStudent->scheduleTimeslot->timeslot;
                $class = $classScheduleTimeslotStudent->scheduleTimeslot->classSchedule->class;
                $array = [
                    'student_id' => $this->id,
                    'schedule_id' => $schedule->id,
                    'timeslot_id' => $timeslot->id,
                    'classScheduleTimeslot_id' => $classScheduleTimeslotStudent->scheduleTimeslot->id,
                    'classScheduleTimeslotStudent_id' => $classScheduleTimeslotStudent->id,
                    'schedule_days' => $schedule->days,
                    'timeslot_hour' => $timeslot->hour,
                    'class_id' => $class->id,
                    'plan_id' => $class->plan->id,
                    'plan_name' => $class->plan->name
                ];
                return $array;
            });
        }
        $expiration = null;
        $daysOverdue = null;
        $payment = Payment::where('student_id', $this->id)->latest()->first();
        if ($payment !== null) {
            $expiration = $payment->expiration_date;
            //turn expiration date into Carbon object
            $expiration = Carbon::createFromFormat('Y-m-d', $expiration);
            $daysOverdue = $expiration->diffInDays(Carbon::now());

        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'last_name' => $this->last_name,
            'registration_date' => $this->registration_date,
            'status' => $this->status,
            'email' => $this->email,
            'phone' => $this->phone,
            'dni' => $this->dni,
            'schedules' => $classScheduleTimeslotStudents,
            'paymentDueDate' => $expiration,
            'daysOverdue' => $daysOverdue,
            'branch' => new BranchResource($this->whenLoaded('branch')),
            'classes' => ClasseResource::collection($this->whenLoaded('classes')),
            'attendances' => AttendanceResource::collection($this->whenLoaded('attendances')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}
