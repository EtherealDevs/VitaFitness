<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['name', 'price', 'description'];

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
