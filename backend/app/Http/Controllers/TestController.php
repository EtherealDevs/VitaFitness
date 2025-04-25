<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Http\Resources\ClassScheduleTimeslotStudentResource;
use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function index()
    {
        $classes = Classe::all();
        $classes->load('classSchedules.classScheduleTimeslots.classStudents');
        $classResource = ClasseResource::collection($classes);
        // $timeslotStudentResource = ClassScheduleTimeslotStudentResource::collection($class->classSchedules->first()->classScheduleTimeslots->first()->classStudents);
        $data = [
            'classScheduleTimeslotStudents' => $classResource,
            'message' => 'ClassScheduleTimeslotStudents created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
        dd($class->classSchedules->first()->classScheduleTimeslots->first()->classStudents, $classResource, $timeslotStudentResource); 
        $classes = Classe::all();
        $classSchedules = ClassSchedule::all();
        $classScheduleTimeslots = ClassScheduleTimeslot::first();
        $relationshipTest = $classScheduleTimeslots;
        // dd($classes[0]->schedules[0]->timeslots[2]->students);
        // dd($relationshipTest->students);
        // dd(['class' => $classes, 'classSchedule' => $classSchedules, 'classScheduleTimeslot' => $classScheduleTimeslots]);

    }
}
