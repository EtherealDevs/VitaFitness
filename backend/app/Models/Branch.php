<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{

    protected $fillable = ['name', 'address'];

    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
