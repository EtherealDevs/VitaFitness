<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $with = ['timeslots'];
    protected $table = 'schedules';
    protected $casts = [
        'days' => 'array',
    ];
    protected $fillable = ['days'];
    public $timestamps = true;
    protected $hidden = ['created_at', 'updated_at'];

    public function classes()
    {
        return $this->belongsToMany(Classe::class, 'class_schedules', 'schedule_id', 'class_id');
    }
    public function timeslots()
    {
        return $this->belongsToMany(TimeSlot::class, 'class_schedule_timeslots', 'class_schedule_id', 'timeslot_id');
    }
}
