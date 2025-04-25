<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'dni', 'last_name'];

    public function timeslots()
    {
        return $this->belongsToMany(ClassScheduleTimeslot::class, 'class_schedule_timeslot_teachers', 'teacher_id', 'c_sch_ts_id');
    }

    public function schedules()
    {
        return $this->hasManyThrough(
            Schedule::class,
            ClassSchedule::class,
            'id', // Foreign key on ClassScheduleTimeslot (class_schedule_id → ClassSchedule.id)
            'id', // Foreign key on Schedule (schedule_id → Schedules.id)
            'id', // Local key on Teacher (teacher_id)
            'schedule_id' // Local key on ClassSchedule
        );
    }

    public function classes()
    {
        return $this->hasManyThrough(
            Classe::class,
            ClassSchedule::class,
            'id', // Foreign key on ClassScheduleTimeslot (class_schedule_id → ClassSchedule.id)
            'id', // Foreign key on Class (class_id → Classes.id)
            'id', // Local key on Teacher (teacher_id)
            'class_id' // Local key on ClassSchedule
        );
    }
}
