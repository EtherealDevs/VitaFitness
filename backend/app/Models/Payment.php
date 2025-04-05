<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected $fillable = [
        'classSchedule_id',
        'payment_date',
        'amount',
        'status',
        'date_start',
        'expiration_date',
    ];

    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
