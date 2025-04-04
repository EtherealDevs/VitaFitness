<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
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
            'address' => $this->address,
            'students' => StudentResource::collection($this->whenLoaded('students')),
            'classes' => ClasseResource::collection($this->whenLoaded('classes')),
            'teachers' => TeacherResource::collection($this->whenLoaded('teachers')),
        ];
    }
}
