<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassTeacher extends Model
{
    /** @use HasFactory<\Database\Factories\ClassTeacherFactory> */
    use HasFactory;

    public function class(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
