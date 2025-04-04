<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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
    public function scopeSearch(Builder $query, string $searchTerm, ?string $field = null): Builder
    {
        $allowedFields = ['name', 'last_name', 'id', 'phone', 'email', 'dni'];
        $exactFields = ['id', 'dni'];
        $searchTerm = trim($searchTerm);

        if ($field && in_array($field, $allowedFields)) {
            if (in_array($field, $exactFields)) {
                return $query->where($field, '=', $searchTerm);
            } else {
                return $query->where($field, 'LIKE', "%{$searchTerm}%");
            }
        }

        return $query->where(function ($q) use ($searchTerm, $allowedFields, $exactFields) {
            foreach ($allowedFields as $allowedField) {
                if (in_array($allowedField, $exactFields)) {
                    $q->orWhere($allowedField, '=', $searchTerm);
                } else {
                    $q->orWhere($allowedField, 'LIKE', "%{$searchTerm}%");
                }
            }
        });
    }
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
    public function classScheduleTimeSlots()
    {
        return $this->belongsToMany(ClassScheduleTimeslot::class, 'class_schedule_timeslot_students', 'student_id', 'c_sch_ts_id');
    }

    public function payments()
    {
        return $this->hasManyThrough(Payment::class, Classe::class, 'id', 'class_id', 'id', 'id');
    }


    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }
    public function attendances()
    {
        return $this->hasManyThrough(Attendance::class, ClassScheduleTimeslotStudent::class, 'c_sch_ts_id', 'c_sch_ts_student_id', 'id', 'student_id');
    }
}
