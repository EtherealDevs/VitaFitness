<?php

namespace App\Http\Resources;

use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $comprobante = null;
        if ($this->relationLoaded('comprobante') && $this->comprobante && $this->comprobante->url) {
            $comprobante = asset('storage/' . $this->comprobante->url);
        }
        $student_full_name = null;
        if ($this->relationLoaded('student')) {
            $student = Student::find($this->student_id);
            $student_first_name = trim($student->name);
            $student_last_name = trim($student->last_name);
            $student_full_name = $student_first_name . ' ' . $student_last_name;
        }
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'student_full_name' => $student_full_name,
            'classSchedule_id' => $this->classSchedule_id,
            'class_id' => $this->class->id,
            'schedule_id' => $this->class->schedule->id,
            'schedule_days' => $this->class->schedule->day,
            'timeslot_id' => $this->class->timeslot->id,
            'timeslot_hour' => $this->class->timeslot->hour,
            'class_price' => $this->class->price,
            'plan_id' => $this->class->plan->id,
            'plan_name' => $this->class->plan->name,
            'branch_name' => $this->class->branch->name,
            'branch_id' => $this->class->branch->id,
            'classSchedule' => new ClassScheduleResource($this->whenLoaded('classSchedule')),
            'comprobante' => $comprobante,
            'date_start' => $this->date_start,
            'amount' => (float)$this->amount,
            'status' => $this->status,
            'payment_date' => $this->payment_date,
            'expiration_date' => $this->expiration_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
