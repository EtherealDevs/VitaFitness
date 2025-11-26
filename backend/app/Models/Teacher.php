<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Teacher extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'dni', 'last_name'];

    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, 'class_teachers', 'teacher_id', 'class_id');
    }
}
