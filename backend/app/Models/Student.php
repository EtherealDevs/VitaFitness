<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'dni',
        'last_name',
        'status',
        'branch_id',
        'registration_date',
    ];
    public function timeslots()
    {
        return $this->belongsToMany(ClassScheduleTimeslot::class, 'class_schedule_timeslot_students', 'student_id', 'c_sch_ts_id');
    }

    public function schedules()
    {
        return $this->hasManyThrough(
            Schedule::class,
            ClassSchedule::class,
            'id',
            'id',
            'id',
            'schedule_id'
        );
    }

    public function classes()
    {
        return $this->hasManyThrough(
            Classe::class,
            ClassSchedule::class,
            'id',
            'id',
            'id',
            'class_id'
        );
    }


    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
