<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ClassScheduleTimeslotController;
use App\Http\Controllers\ClassScheduleTimeslotStudentController;
use App\Http\Controllers\ClassScheduleTimeslotTeacherController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSchedulesController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user();
    $user->load('roles');
    // User::find($user->id);
    return $user;
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/upload/comprobante', [PaymentController::class, 'storeComprobante']);
    Route::get('/comprobante/download/{filename}', [PaymentController::class, 'downloadComprobante']);
    Route::get('/attendances/getAllForCurrent', [AttendanceController::class, 'getAllAttendancesForCurrentStudent']);
    Route::apiResource('class/timeslots', ClassScheduleTimeslotController::class);
    Route::apiResource('attendances', AttendanceController::class);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('branches', BranchController::class)->except(['index', 'show']);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('classSchedules', ClassScheduleController::class);
    Route::apiResource('classes', ClasseController::class);
    Route::apiResource('class/students', ClassScheduleTimeslotStudentController::class);
    Route::apiResource('class/teachers', ClassScheduleTimeslotTeacherController::class);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('plans', PlanController::class)->except(['index', 'show']);
    Route::apiResource('schedules', ClassScheduleTimeslotController::class)->except(['index', 'show']);
    Route::apiResource('users', UserController::class)->only(['index', 'update']);
    Route::get('users/roles', [UserController::class, 'roles']);
});
Route::apiResource('payments', PaymentController::class);
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('plans', PlanController::class)->only(['index', 'show']);
Route::apiResource('schedules', SchedulesController::class)->only(['index', 'show']);
Route::get('payments/student/{id}', [PaymentController::class, 'student']);
Route::put('payments/student/{id}', [PaymentController::class, 'updatestudent']);
Route::get('student/search', [StudentController::class, 'search']);
Route::get('/student/{id}/class-status', [StudentController::class, 'getClassStatus']);
Route::get('/statistics', [StatisticsController::class, 'index']);
Route::apiResource('branches', BranchController::class)->only(['index', 'show']);
