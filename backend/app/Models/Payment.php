<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected $fillable = [
        'class_id',
        'payment_date',
        'amount',
        'status',
        'date_start',
        'expiration_date',
    ];

    public function class()
    {
        return $this->belongsTo(Classe::class, 'class_id');
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
