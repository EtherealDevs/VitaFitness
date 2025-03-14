<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedules extends Model
{
    protected $table = 'schedules';
    protected $fillable = ['day', 'start_time', 'end_time'];
    public $timestamps = true;
    protected $hidden = ['created_at', 'updated_at'];
}
