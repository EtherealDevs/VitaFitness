<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index()
    {
        $classes = Classe::all();
        $classSchedules = ClassSchedule::all();
        $classScheduleTimeslots = ClassScheduleTimeslot::first();
        $relationshipTest = $classScheduleTimeslots;
        dd($classes[0]->schedules[0]->timeslots[2]->students);
        dd($relationshipTest->students);
        dd(['class' => $classes, 'classSchedule' => $classSchedules, 'classScheduleTimeslot' => $classScheduleTimeslots]);

    }
}
