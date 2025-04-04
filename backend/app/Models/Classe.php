<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classe extends Model
{
    protected $with = ['branch', 'plan', 'schedules'];

    protected $fillable = ['precio', 'max_students', 'branch_id', 'plan_id', 'schedule_id', 'teacher_id', 'student_id', 'timeslot_id'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
    public function schedules()
    {
        return $this->belongsToMany(Schedule::class, 'class_schedules', 'class_id', 'schedule_id');
    }
    public function payment()
    {
        return $this->hasMany(Payment::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    // public function timeslot()
    // {
    //     return $this->belongsTo(TimeSlot::class);
    // }
    // public function teacher()
    // {
    //     return $this->belongsTo(Teacher::class);
    // }
    // public function student()
    // {
    //     return $this->belongsTo(Student::class);
    // }
}
