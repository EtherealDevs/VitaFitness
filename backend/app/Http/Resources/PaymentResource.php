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
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'plan' => new PlanResource($this->whenLoaded('plan')),
            'plan_id' => $this->plan_id,
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
