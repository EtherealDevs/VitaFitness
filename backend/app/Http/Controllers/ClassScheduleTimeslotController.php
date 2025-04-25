<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use App\Models\Schedule;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ClassScheduleTimeslotController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'class_schedule_id' => 'required|integer|exists:class_schedules,id',
            'timeslot_id' => 'required|integer|exists:class_schedule_timeslots,id',
        ]);


        $classSchedule = ClassSchedule::find($request->class_schedule_id);
        $timeSlot = TimeSlot::find($request->timeslot_id);
        if ($classSchedule->timeslots->contains($timeSlot)) {
            return response()->json([
                'message' => 'El horario ya existe en la clase',
                'status' => 'error (400)'
            ], 400);
        }
        if (!$timeSlot)
        {
            $availableTimeslots = [
                1 => '08:00',
                2 => '09:00',
                3 => '10:00',
                4 => '11:00',
                5 => '12:00',
                6 => '13:00',
                7 => '14:00',
                8 => '15:00',
                9 => '16:00',
                10 => '17:00',
                11 => '18:00',
                12 => '19:00',
                13 => '20:00',
                14 => '21:00',
                15 => '22:00',
                16 => '23:00',
                17 => '00:00',
                18 => '01:00',
                19 => '02:00',
                20 => '03:00',
                21 => '04:00',
                22 => '05:00',
                23 => '06:00',
                24 => '07:00',
            ];
            $timeSlot = TimeSlot::create([
                'id' => $request->timeslot_id,
                'hour' => $availableTimeslots[$request->timeslot_id],
            ]);
        }
        $classSchedule->timeslots()->syncWithoutDetaching($timeSlot);
        $classSchedule->save();

        return response()->json([
            'message' => 'ClassScheduleTimeslot created successfully',
            'status' => 'success (201)'
        ], 201);
    }
}
