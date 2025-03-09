<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'last_name' => $this->last_name,
            'registration_date' => $this->registration_date,
            'status' => $this->status,
            'email' => $this->email,
            'phone' => $this->phone,
            'dni' => $this->dni,
            'branch' => new BranchResource($this->whenLoaded('branch')),
        ];
    }
}
