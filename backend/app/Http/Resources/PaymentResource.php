<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'classSchedule_id' => $this->classSchedule_id,
            'class_id' => $this->classSchedule->class->id,
            'classSchedule' => new ClassScheduleResource($this->whenLoaded('classSchedule')),
            'comprobante' => $comprobante,
            'date_start' => $this->date_start,
            'amount' => $this->amount,
            'status' => $this->status,
            'payment_date' => $this->payment_date,
            'expiration_date' => $this->expiration_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
