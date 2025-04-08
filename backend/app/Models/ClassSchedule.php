<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\ClassScheduleFactory> */
    use HasFactory;
    protected $fillable = ['class_id', 'schedule_id'];
    protected $table = 'class_schedules';

    public function class()
    {
        return $this->belongsTo(Classe::class);
    }
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
    public function timeslots()
    {
        return $this->belongsToMany(TimeSlot::class, 'class_schedule_timeslots', 'class_schedule_id', 'timeslot_id');
    }
    public function classScheduleTimeslots()
    {
        return $this->hasMany(ClassScheduleTimeslot::class);
    }
    public function students()
    {
        return $this->hasManyThrough(Student::class, ClassScheduleTimeslotStudent::class, 'c_sch_ts_id', 'id', 'id', 'student_id');
    }
    public function teachers()
    {
        return $this->hasManyThrough(Teacher::class, ClassScheduleTimeslotTeacher::class, 'c_sch_ts_id', 'id', 'id', 'teacher_id');
    }
}
