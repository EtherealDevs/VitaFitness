<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    protected $with = ['branch', 'plan', 'schedule', 'timeslot', 'teacher', 'student'];

    protected $fillable = ['precio', 'max_students', 'branch_id', 'plan_id', 'schedule_id', 'teacher_id', 'student_id', 'timeslot_id'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
    public function timeslot()
    {
        return $this->belongsTo(TimeSlot::class);
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
