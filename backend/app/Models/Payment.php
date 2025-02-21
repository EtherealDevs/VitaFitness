<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected $fillable = [
        'student_id',
        'plan_id',
        'date_start',
        'amount',
        'status',
        'payment_date',
        'expiration_date',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
