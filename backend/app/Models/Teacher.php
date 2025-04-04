<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'dni', 'branch_id', 'last_name'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function plans()
    {
        return $this->belongsToMany(Plan::class, 'teacher_plans');
    }

    public function schedules()
    {
        return $this->hasMany(TeacherSchedules::class);
    }
}
