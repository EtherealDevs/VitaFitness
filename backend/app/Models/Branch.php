<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{

    protected $fillable = ['name', 'address'];

    public function students()
    {
        return $this->hasManyThrough(
            Student::class,
            ClassSchedule::class,
            'id', // Foreign key on ClassScheduleTimeslot (class_schedule_id → ClassSchedule.id)
            'id', // Foreign key on Schedule (schedule_id → Schedules.id)
            'id', // Local key on Teacher (teacher_id)
            'schedule_id' // Local key on ClassSchedule
        );
    }

    public function teachers()
    {
        return $this->hasManyThrough(
            Teacher::class,
            ClassSchedule::class,
            'id', // Foreign key on ClassScheduleTimeslot (class_schedule_id → ClassSchedule.id)
            'id', // Foreign key on Schedule (schedule_id → Schedules.id)
            'id', // Local key on Teacher (teacher_id)
            'schedule_id' // Local key on ClassSchedule
        );
    }

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
