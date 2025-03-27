<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'dni', 'branch_id', 'last_name'];

    public function classes()
    {
        return $this->hasMany(Classe::class);
    }
}
