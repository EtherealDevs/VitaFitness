<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $table = 'schedules';
    protected $casts = [
        'days' => 'array',
    ];
    protected $fillable = ['days'];
    public $timestamps = true;
    protected $hidden = ['created_at', 'updated_at'];
}
