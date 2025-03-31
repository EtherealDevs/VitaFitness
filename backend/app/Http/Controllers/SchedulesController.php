<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Http\Resources\SchedulesResource;
use App\Models\Schedule;
use Illuminate\Http\Request;

class SchedulesController extends Controller
{

    public function index()
    {
        try {

            $schedules = Schedule::all();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los horarios',
                'error' => $e->getMessage()
            ], 500);
        }
        $data = [
            'message' => 'Horarios obtenidos correctamente',
            'schedules' => $schedules,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'days' => 'required|in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
        ]);
        try {
            $schedule = Schedule::create($request->all());
            $schedule = new ScheduleResource($schedule);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el horario',
                'error' => $e->getMessage()
            ], 500);
        }
        $data = [
            'message' => 'Horario creado correctamente',
            'schedule' => $schedule,
            'status' => 201
        ];
        return response()->json($data, 201);
    }

    public function show(string $id)
    {
        try {
            $schedule = Schedule::find($id);
            $schedule = new ScheduleResource($schedule);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el horario',
                'error' => $e->getMessage()
            ], 500);
        }
        $data = [
            'message' => 'Horario obtenido correctamente',
            'schedule' => $schedule,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'day' => 'in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
            'start_time' => 'date_format:H:i',
            'end_time' => 'date_format:H:i'
        ]);
        try {
            $schedule = Schedule::find($id);
            $schedule->update($request->all());
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el horario',
                'error' => $e->getMessage()
            ], 500);
        }
        $data = [
            'message' => 'Horario actualizado correctamente',
            'schedule' => $schedule,
            'status' => 200
        ];
        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        try {
            $schedule = Schedule::find($id);
            $schedule->delete();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el horario',
                'error' => $e->getMessage()
            ], 500);
        }
        $data = [
            'message' => 'Horario eliminado correctamente',
            'status' => 200
        ];
        return response()->json($data, 200);
    }
}
