<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherSchedules extends Model
{
    protected $table = 'teacher_schedules';
    protected $fillable = [
        'teacher_id',
        'day',
        'start_time',
        'end_time',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
