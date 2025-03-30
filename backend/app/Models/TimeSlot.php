<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeSlot extends Model
{
    protected $table = "timeslots";
    protected $fillable = ['hour'];

    public function schedules()
    {
        return $this->belongsToMany(Schedule::class, 'class_schedule_timeslots', 'timeslot_id', 'class_schedule_id');
    }

    public function classScheduleTimeslots()
    {
        return $this->hasMany(ClassScheduleTimeslot::class, 'timeslot_id');
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'class_schedule_timeslot_students', 'c_sch_ts_id', 'student_id');
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'class_schedule_timeslot_teachers', 'c_sch_ts_id', 'teacher_id');
    }
}
