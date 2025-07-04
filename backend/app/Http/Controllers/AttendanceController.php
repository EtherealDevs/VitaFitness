<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslotStudent;
use App\Models\Student;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $attendances = Attendance::with('student', 'classe')->get();
        } catch (\Throwable $th) {
            throw $th;
        }
        $attendances = AttendanceResource::collection($attendances);
        $data = [
            'attendances' => $attendances,
            'message' => 'Attendances retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    public function getAllAttendancesForCurrentStudent() 
    {
        // Obtener el estudiante actual
        // $user = FacadesAuth::user();
        $testStudent = Student::where('dni', '87654321')->first();
        $student = $testStudent;
        // $student = Student::where('dni', $user->dni)->first();


        $classStudents = $student->timeslotStudents;
        $ids = [];
        foreach ($classStudents as $classStudent) {
            $ids[] = $classStudent->id;
        }
        // Obtener todas las asistencias para este estudiante
        try {
            $attendances = Attendance::with(['student', 'timeslotStudent.scheduleTimeslot.classSchedule'])->whereIn('c_sch_ts_student_id', $ids)->get();
        } catch (\Throwable $th) {
            throw $th;
        }
        $attendances = AttendanceResource::collection($attendances);
        $data = [
            'attendances' => $attendances,
            'message' => 'Attendances retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'students_id' => 'required|exists:students,id',
            'classes_id' => 'required|exists:classes,id',
            'date' => 'required'
        ]);
        try {
            $attendance = Attendance::create($request->all());
        } catch (\Throwable $th) {
            throw $th;
        }
        $attendance = new AttendanceResource($attendance);
        $data = [
            'attendance' => $attendance,
            'message' => 'Attendance created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $attendance = Attendance::with('student', 'classe')->find($id);
        } catch (\Throwable $th) {
            throw $th;
        }
        if (!$attendance) {
            $data = [
                'message' => 'Attendance not found',
                'status' => 'error (404)'
            ];
            return response()->json($data, 404);
        }
        $attendance = new AttendanceResource($attendance);
        $data = [
            'attendance' => $attendance,
            'message' => 'Attendance retrieved successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'students_id' => 'exists:students,id',
            'classes_id' => 'exists:classes,id',
            'date' => 'required'
        ]);
        try {
            $attendance = Attendance::find($id);
            if (!$attendance) {
                $data = [
                    'message' => 'Attendance not found',
                    'status' => 'error (404)'
                ];
                return response()->json($data, 404);
            }
            $attendance->update($request->all());
        } catch (\Throwable $th) {
            throw $th;
        }
        $attendance = new AttendanceResource($attendance);
        $data = [
            'attendance' => $attendance,
            'message' => 'Attendance updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $attendance = Attendance::find($id);
            if (!$attendance) {
                $data = [
                    'message' => 'Attendance not found',
                    'status' => 'error (404)'
                ];
                return response()->json($data, 404);
            }
            $attendance->delete();
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
