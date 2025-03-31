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
    public function create()
    {
        $classes = Classe::all();
        $schedules = ClassSchedule::all();
        return view('create-timeslot', compact('classes', 'schedules'));
    }
    public function store(Request $request)
    {
        // ------- VALIDACIONES -------
        // Primero validar class
        $request->validate([
            'class_id' => 'required|integer|exists:classes,id',
        ]);
        // Segundo validar dias
        $request->validate([
            'days.*' => 'required|in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
        ]);
        // Tercero validar horario
        $request->validate([
            'time_start' => 'required|date_format:H:i',
            'time_end' => 'required|date_format:H:i',
        ]);
        // ------- ------------- -------


        // Inicializar variables
        $class_id = $request->class_id;
        $days = $request->days;

        $time_start = Carbon::createFromFormat('H:i', $request->time_start);
        $time_end = Carbon::createFromFormat('H:i', $request->time_end);
        $timeslots = [];
        $timeslotModels = [];
            while ($time_start <= $time_end) {
                $timeslots[] = $time_start->format('H:i');
                $time_start->addHour(); // Move to the next hour
            }
            foreach ($timeslots as $timeslot) {
                $timeslotModel = TimeSlot::where('hour', $timeslot)->firstOrCreate([
                    'hour' => $timeslot,
                ]);
                $timeslotModels[] = $timeslotModel;
            }


        // Buscar schedule. Si existe usarlo, si no existe crearlo.
        try {
            $schedule = Schedule::whereJsonContains('days', $days)
            ->whereRaw("JSON_LENGTH(days) = ?", [count($days)])
            ->first();
            if ($schedule == null) {
                $schedule = Schedule::create([
                    'days' => $days,
                ]);
            }
            $schedule_id = $schedule->id;
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // Crear clase_schedule. Si ya existe usarlo, si no existe crearlo.
        try {
            $classSchedule = ClassSchedule::where('class_id', $request->class_id)->where('schedule_id', $schedule->id)->firstOrCreate([
                'class_id' => $class_id,
                'schedule_id' => $schedule_id,
            ]);
            $classSchedule_id = $classSchedule->id;
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // Crear class_schedule_timeslot. Si ya existe usarlo, si no existe crearlo.
        foreach ($timeslotModels as $timeslotModel) {
            $classScheduleTimeslot = null;
            $timeslot_id = $timeslotModel->id;
            try {
                $classScheduleTimeslot = ClassScheduleTimeslot::where('class_schedule_id', $classSchedule_id)->where('timeslot_id', $timeslot_id)
                ->firstOrCreate([
                    'class_schedule_id' => $classSchedule_id,
                    'timeslot_id' => $timeslot_id,
                ]);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }

        return response()->json([
            'message' => 'ClassScheduleTimeslot created successfully',
            'status' => 'success (201)'
        ], 201);
        // $classSchedule = new ClassScheduleResource($classSchedule);
        // $data = [
        //     'classSchedule' => $classSchedule,
        //     'message' => 'ClassSchedule created successfully',
        //     'status' => 'success (201)'
        // ];
        // return response()->json($data, 201);

        // $classScheduleTimeslot = new ClassScheduleTimeslotResource($classScheduleTimeslot);
        // $data = [
        //     'classScheduleTimeslot' => $classScheduleTimeslot,
        //     'message' => 'ClassScheduleTimeslot created successfully',
        //     'status' => 'success (201)'
        // ];
    }
}
