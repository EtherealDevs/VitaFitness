<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeacherAvailabilitie extends Model
{
    protected $fillable = [
        'teacher_id',
        'schedule_id',
        'branch_id'
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function schedule()
    {
        return $this->belongsTo(Schedules::class);
    }
}
