<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassStudent extends Model
{
    /** @use HasFactory<\Database\Factories\ClassStudentFactory> */
    use HasFactory;

    public function class(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
