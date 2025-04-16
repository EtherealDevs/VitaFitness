<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClassScheduleTimeslotTeacherResource;
use App\Models\ClassScheduleTimeslot;
use App\Models\ClassScheduleTimeslotTeacher;
use App\Models\Payment;
use App\Models\Teacher;
use Illuminate\Http\Request;

class ClassScheduleTimeslotTeacherController extends Controller
{
    public function index(Request $request)
    {
        $classScheduleTimeslotTeachers = ClassScheduleTimeslotTeacher::all();
        $classScheduleTimeslotTeachers->load('timeslot');
        $data = [
            'classScheduleTimeslotTeachers' => ClassScheduleTimeslotTeacherResource::collection($classScheduleTimeslotTeachers),
            'message' => 'ClassScheduleTimeslotTeachers retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function create()
    {
        $classSchedule = ClassSchedule::first();
        $teachers = Teacher::all();
        $timeslot = $classSchedule->classScheduleTimeslots()->first();
        // dd($timeslot);
        $classSchedule->load('class', 'schedule', 'students', 'teachers');
        return view('create-classTeacher', ['classSchedule' => $classSchedule, 'teachers' => $teachers, 'timeslot' => $timeslot]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'teachers' => 'required|array',
            'teachers.*' => 'required|integer|exists:teachers,id',
            'c_sch_ts_id' => 'required|integer|exists:class_schedule_timeslots,id',
        ]);
        
        $classScheduleTimeslot = ClassScheduleTimeslot::find($request->c_sch_ts_id);
        foreach ($request->teachers as $teacher) {
            $teacher = Teacher::find($teacher);
            try {
                $classScheduleTimeslot->teachers()->syncWithoutDetaching($teacher);
                
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
        
        return response()->json([
            'message' => 'ClassScheduleTimeslotTeachers created successfully',
            'status' => 'success (201)'
        ], 201);
    }
    public function edit(Request $request)
    {
        $classScheduleTimeslot = ClassScheduleTimeslot::find($id);
        $teachers = [];
        $teachersInClass = $classScheduleTimeslot->teachers;
        $payments = Payment::where('status', 'pagado')->where('classSchedule_id', $classScheduleTimeslot->classSchedule->id)->get();
        foreach ($payments as $payment) {
            $teachers[] = $payment->teacher;
        }

        return view('edit-classTeacher', ['classScheduleTimeslot' => $classScheduleTimeslot, 'teachers' => $teachers]);
    }
    public function update(Request $request)
    {
        $request->validate([
            'teachers' => 'required|array',
            'teachers.*' => 'required|integer|exists:teachers,id',
            'c_sch_ts_id' => 'required|integer|exists:class_schedule_timeslots,id',
        ]);
        
        $classScheduleTimeslot = ClassScheduleTimeslot::find($request->c_sch_ts_id);
        foreach ($request->teachers as $teacher) {
            $teacher = Teacher::find($teacher);
            try {
                $classScheduleTimeslot->teachers()->sync($teacher);
                
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
        $classScheduleTimeslotTeachers = ClassScheduleTimeslotTeacher::where('c_sch_ts_id', $request->c_sch_ts_id)->whereIn('teacher_id', $request->teachers)->get();
        
        // collection of resources
        $classScheduleTimeslotTeachersResource = ClassScheduleTimeslotTeacherResource::collection($classScheduleTimeslotTeachers);
        $data = [
            'classScheduleTimeslotTeachers' => $classScheduleTimeslotTeachersResource,
            'message' => 'ClassScheduleTimeslotTeachers updated successfully',
            'status' => 'success (204)'
        ];
        return response()->json($data, 204);
    }
    public function destroy(string $id)
    {
        try {
            $classScheduleTimeslotTeacher = ClassScheduleTimeslotTeacher::find($id);
            $classScheduleTimeslotTeacher->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'ClassScheduleTimeslotTeacher deleted successfully',
            'status' => 'success (204)'
        ];
        return response()->json($data, 204);
    }
}
