<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassScheduleTimeslot extends Model
{
    protected $fillable = ['timeslot_id', 'class_schedule_id'];
    protected $table = 'class_schedule_timeslots';
    /** @use HasFactory<\Database\Factories\ScheduleTimeslotFactory> */
    use HasFactory;

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'class_schedule_id', 'id');
    }
    public function class()
    {
        return $this->hasOneThrough(Classe::class, ClassSchedule::class, 'id', 'id', 'class_schedule_id', 'class_id');
    }
    public function schedule()
    {
        return $this->hasOneThrough(Schedule::class, ClassSchedule::class, 'id', 'id', 'class_schedule_id', 'schedule_id');
    }
    public function timeslot()
    {
        return $this->belongsTo(TimeSlot::class);
    }
    public function classStudents()
    {
        return $this->hasMany(ClassScheduleTimeslotStudent::class, 'c_sch_ts_id');
    }
    public function classTeachers()
    {
        return $this->hasMany(ClassScheduleTimeslotTeacher::class, 'c_sch_ts_id');
    }
    public function students()
    {
        return $this->belongsToMany(Student::class, 'class_schedule_timeslot_students', 'c_sch_ts_id', 'student_id');
    }
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'class_schedule_timeslot_teachers', 'c_sch_ts_id', 'teacher_id');
    }
    public function attendances()
    {
        return $this->hasManyThrough(Attendance::class, ClassScheduleTimeslotStudent::class, 'c_sch_ts_id', 'c_sch_ts_student_id', 'id', 'student_id');
    }

}
