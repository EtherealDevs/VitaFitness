<?php

namespace App\Models;

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
    public function classes()
    {
        return $this->hasMany(Classe::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function plans()
    {
        return $this->belongsToMany(Plan::class);
    }
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
