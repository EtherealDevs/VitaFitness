<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{

    protected $fillable = ['max_students', 'teacher_schedules_id', 'branch_id', 'time', 'day'];

    public function teacherSchedule()
    {
        return $this->belongsTo(TeacherSchedules::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
