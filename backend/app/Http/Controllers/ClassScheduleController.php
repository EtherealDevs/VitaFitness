<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClassScheduleResource;
use App\Models\Classe;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use App\Models\Schedule;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ClassScheduleController extends Controller
{
    public function index()
    {
        try {
            $classSchedules = ClassSchedule::all();
            $classSchedules->load('class', 'schedule', 'students', 'teachers');
        } catch (\Throwable $th) {
            throw $th;
        }
        // return view('index-classSchedule', compact('classSchedules'));
        $data = [
            'classSchedules' => ClassScheduleResource::collection($classSchedules),
            'message' => 'ClassSchedules retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function show(string $id)
    {
        try {
            $classSchedule = ClassSchedule::find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classSchedule->load('class', 'schedule', 'students', 'teachers', 'classScheduleTimeslots.classStudents', 'classScheduleTimeslots.classTeachers');
        $classSchedule = new ClassScheduleResource($classSchedule);
        $data = [
            'classSchedule' => $classSchedule,
            'message' => 'ClassSchedule retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function create()
    {
        $classes = Classe::all();
        $schedules = ClassSchedule::all();
        return view('create-classSchedule', compact('classes', 'schedules'));
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
            'message' => 'ClassSchedule created successfully',
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
    public function edit(Request $request)
    {
        $classes = Classe::all();
        $classSchedule = ClassSchedule::find($request->id);
        $selectedDays = $classSchedule->schedule->days;
        $timeslots = $classSchedule->timeslots()->orderBy('hour')->get(); 
        $timeslotStartTime = Carbon::parse($timeslots->first()->hour)->format('H:i');
        $timeslotEndTime = Carbon::parse($timeslots->last()->hour)->format('H:i');

        return view('edit-classSchedule', ['classSchedule' => $classSchedule, 'classes' => $classes, 'selectedDays' => $selectedDays, 'timeslotStartTime' => $timeslotStartTime, 'timeslotEndTime' => $timeslotEndTime]);
    }
    public function update(Request $request)
    {
        // ------- VALIDACIONES -------
        // Primero validar class y class_schedule
        $request->validate([
            'class_id' => 'required|integer|exists:classes,id',
            'class_schedule_id' => 'required|integer|exists:class_schedules,id',
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
        $class_schedule_id = $request->class_schedule_id;
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

            // Buscar clase_schedule.
            try {
                $classSchedule = ClassSchedule::find($class_schedule_id)->update([
                    'class_id' => $class_id,
                    'schedule_id' => $schedule_id,
                ]);
                $classSchedule_id = $class_schedule_id;
                $old_timeslots = ClassScheduleTimeslot::where('class_schedule_id', $classSchedule_id)->get();
                $old_timeslots->each(function ($classScheduleTimeslot) {
                    $classScheduleTimeslot->delete();
                });
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
                    $classScheduleTimeslot->update([
                        'class_schedule_id' => $classSchedule_id,
                        'timeslot_id' => $timeslot_id,
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['message' => $e->getMessage()], 500);
                }
            }

        return response()->json([
            'message' => 'ClassScheduleTimeslot updated successfully',
            'status' => 'success (204)'
        ], 204);
    }
}
