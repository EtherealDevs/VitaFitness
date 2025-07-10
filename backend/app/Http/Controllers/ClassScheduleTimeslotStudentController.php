<?php

namespace App\Http\Controllers;

use App\Http\Resources\ClassScheduleTimeslotStudentResource;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslot;
use App\Models\ClassScheduleTimeslotStudent;
use App\Models\Payment;
use App\Models\Student;
use Illuminate\Http\Request;

class ClassScheduleTimeslotStudentController extends Controller
{
    public function index()
    {
        $classScheduleTimeslotStudents = ClassScheduleTimeslotStudent::all();
        $classScheduleTimeslotStudents->load('timeslot');
        $data = [
            'classScheduleTimeslotStudents' => ClassScheduleTimeslotStudentResource::collection($classScheduleTimeslotStudents),
            'message' => 'ClassScheduleTimeslotStudents retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function create()
    {
        $classSchedule = ClassSchedule::first();
        $students = Student::all();
        $timeslot = $classSchedule->classScheduleTimeslots()->first();
        // dd($timeslot);
        $classSchedule->load('class', 'schedule', 'students', 'teachers');
        return view('create-classStudent', ['classSchedule' => $classSchedule, 'students' => $students, 'timeslot' => $timeslot]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'students' => 'required|array',
            'students.*' => 'required|integer|exists:students,id',
            'c_sch_ts_id' => 'required|integer|exists:class_schedule_timeslots,id',
        ]);

        $classScheduleTimeslot = ClassScheduleTimeslot::find($request->c_sch_ts_id);
        foreach ($request->students as $student) {
            $student = Student::find($student);
            try {
                $classScheduleTimeslot->students()->syncWithoutDetaching($student);
            } catch (\Exception $e) {
                return response()->json(['message' => $e->getMessage()], 500);
            }
        }
        $classScheduleTimeslotStudents = ClassScheduleTimeslotStudent::where('c_sch_ts_id', $request->c_sch_ts_id)->whereIn('student_id', $request->students)->get();

        // collection of resources
        $classScheduleTimeslotStudentsResource = ClassScheduleTimeslotStudentResource::collection($classScheduleTimeslotStudents);

        $data = [
            'classScheduleTimeslotStudents' => $classScheduleTimeslotStudentsResource,
            'message' => 'ClassScheduleTimeslotStudents created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }
    // public function edit(Request $request)
    // {
    //     $classScheduleTimeslot = ClassScheduleTimeslot::find($id);
    //     $students = [];
    //     $studentsInClass = $classScheduleTimeslot->students;
    //     $payments = Payment::where('status', 'pagado')->where('classSchedule_id', $classScheduleTimeslot->classSchedule->id)->get();
    //     foreach ($payments as $payment) {
    //         $students[] = $payment->student;
    //     }

    //     return view('edit-classStudent', ['classScheduleTimeslot' => $classScheduleTimeslot, 'students' => $students]);
    // }
    public function show(string $id)
    {
        try {
            $classScheduleTimeslotStudent = ClassScheduleTimeslotStudent::where('student_id', $id)->get();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $classScheduleTimeslotStudent->load('student', 'timeslot', 'scheduleTimeslot');
        $classScheduleTimeslotStudent =  ClassScheduleTimeslotStudentResource::collection($classScheduleTimeslotStudent);
        $data = [
            'classScheduleTimeslotStudent' => $classScheduleTimeslotStudent,
            'message' => 'ClassScheduleTimeslotStudent retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function update(Request $request)
    {
        $request->validate([
            'students' => 'required|array',
            'students.*' => 'required|integer|exists:students,id',
            'c_sch_ts_id' => 'required|integer|exists:class_schedule_timeslots,id',
        ]);
            $classScheduleTimeslot = ClassScheduleTimeslot::find($request->c_sch_ts_id);
            foreach ($request->students as $student) {
                $student = Student::find($student);
                try {
                    $classScheduleTimeslot->students()->syncWithoutDetaching($student);
                } catch (\Exception $e) {
                    return response()->json(['message' => $e->getMessage()], 500);
                }
            }
            $classScheduleTimeslotStudents = ClassScheduleTimeslotStudent::where('c_sch_ts_id', $request->c_sch_ts_id)->whereIn('student_id', $request->students)->get();

        // collection of resources
        $classScheduleTimeslotStudentsResource = ClassScheduleTimeslotStudentResource::collection($classScheduleTimeslotStudents);
        $data = [
            'classScheduleTimeslotStudents' => $classScheduleTimeslotStudentsResource,
            'message' => 'ClassScheduleTimeslotStudent updated successfully',
            'status' => 'success (204)'
        ];
        return response()->json($data, 204);
    }
    public function destroy(string $id)
    {
        try {
            $classScheduleTimeslotStudent = ClassScheduleTimeslotStudent::find($id);
            $classScheduleTimeslotStudent->delete();
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $data = [
            'message' => 'ClassScheduleTimeslotStudent deleted successfully',
            'status' => 'success (204)'
        ];
        return response()->json($data, 204);
    }
}
