<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClasseResource;
use App\Http\Resources\PlanResource;
use App\Models\Classe;
use App\Models\Plan;
use App\Models\Schedule;
use App\Models\TimeSlot;
use Dotenv\Validator;
use Illuminate\Http\Request;

class ClasseController extends Controller
{
    public function index()
    {
        try {
            $classes = Classe::with(['plan', 'branch', 'students', 'teachers'])->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
            $classes = $classes->groupBy(fn($item) => $item->plan_id . '-' . $item->branch_id);
        $classes = $classes->map(function ($items) {
            return [
                'plan_name'   => $items->first()->plan->name,
                'branch_name' => $items->first()->branch->name,
                'details'   => $items->map(function ($item) {
                    return [
                        'timeslot_id' => $item->timeslot_id,
                        'schedule_id' => $item->schedule_id,
                        'price'       => $item->precio,
                        'max_students'=> $item->max_students,
                        'students'    => $item->students,
                        'teachers'    => $item->teachers,
                    ];
                })->values()->all()
            ];
        })->values();
        // $classes = $classes->groupBy(['plan_id', 'branch_id']);
        // dd($classes);
        $data = [
            'classes' => $classes,
            'message' => 'Classes retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function show(string $id)
    {
        try {
            $classe = Classe::with(['plan', 'branch', 'students', 'teachers'])->find($id);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        // $classe = new ClasseResource($classe);
        $data = [
            'classe' => $classe,
            'message' => 'Classe retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function store(Request $request)
    {

        $request->validate([
            'max_students' => 'required|integer',
            'plan_id' => 'required|exists:plans,id',
            'branch_id' => 'required|exists:branches,id',
            'precio' => 'required|integer',
        ]);
        $schedules = [];
        foreach ($request->days as $day) {
            $item = Schedule::find($day);
            array_push($schedules, $item);
        }
        $timeslots = TimeSlot::whereBetween('hour', [$request->time_start, $request->time_end])->get();
        // return response()->json(['message' => [$schedules, $timeslots]], 500);
        foreach ($timeslots as $timeslot) {
        foreach ($schedules as $schedule) {
        // Use Validator to validate Timeslots and Schedules
        try {
            $classe = Classe::create([
                'precio' => $request->precio,
                'max_students' => $request->max_students,
                'branch_id' => $request->branch_id,
                'plan_id' => $request->plan_id,
                'schedule_id' => $schedule->id,
                'timeslot_id' => $timeslot->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        }
        }
        $data = [
            'classe' => $classe,
            'message' => 'Classe created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'max_students' => 'integer',
            'plan_id' => 'exists:plans,id',
            'branch_id' => 'exists:branches,id',
            'price' => 'integer',
            'timeslot_id' => 'exists:timeslots,id',
            'schedule_id' => 'exists:schedules,id',
        ]);
        try {
            $classe = Classe::find($id);
            $classe->update($request->all());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'classe' => $classe,
            'message' => 'Classe updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function availableClasses()
    {
        try {
            $classes = Classe::where('max_students', '>', 0)->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classes = ClasseResource::collection($classes);
        $data = [
            'classes' => $classes,
            'message' => 'Classes retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    public function destroy(string $id)
    {
        try {
            $classe = Classe::find($id);
            $classe->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'Classe deleted successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
}
