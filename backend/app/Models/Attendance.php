<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{

    protected $fillable = ['c_sch_ts_student_id', 'status', 'date'];

    public function timeslotStudent()
    {
        return $this->belongsTo(ClassScheduleTimeslotStudent::class, 'c_sch_ts_student_id');
    }
    public function student()
    {
        return $this->hasOneThrough(
            Student::class,
            ClassScheduleTimeslotStudent::class,
            'id', // Local key on Attendance (timeslot_student_id → TimeslotStudent.id)
            'id', // Local key on Student (student_id → Students.id)
            'c_sch_ts_student_id', // Foreign key on Attendance
            'student_id' // Foreign key on TimeslotStudent
        );
    }
}
