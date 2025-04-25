<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassScheduleTimeslotTeacher extends Model
{
    /** @use HasFactory<\Database\Factories\ClassScheduleTimeslotTeacherFactory> */
    use HasFactory;
    protected $table = 'class_schedule_timeslot_teachers';
    protected $fillable = ['c_sch_ts_id', 'teacher_id'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    public function scheduleTimeslot()
    {
        return $this->belongsTo(ClassScheduleTimeslot::class, 'c_sch_ts_id');
    }
    public function timeslot()
    {
        return $this->hasOneThrough(TimeSlot::class, ClassScheduleTimeslot::class, 'id', 'id', 'c_sch_ts_id', 'timeslot_id');
    }
}
