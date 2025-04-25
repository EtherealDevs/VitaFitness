<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassScheduleTimeslotStudent extends Model
{
    /** @use HasFactory<\Database\Factories\ClassScheduleTimeslotStudentFactory> */
    use HasFactory;
    protected $table = 'class_schedule_timeslot_students';
    protected $fillable = ['c_sch_ts_id', 'student_id'];

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'c_sch_ts_student_id'); 
    }

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
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
