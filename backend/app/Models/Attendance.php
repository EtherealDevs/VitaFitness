<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{

    protected $fillable = ['student_id', 'classe_id', 'date'];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }


    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }
}
