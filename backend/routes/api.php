<?php

use App\Http\Controllers\BranchController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SchedulesController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\TeacherSchedulesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('students', StudentController::class);
    Route::apiResource('branches', BranchController::class);
    Route::apiResource('teachers', TeacherController::class);
    Route::apiResource('teacherSchedules', TeacherSchedulesController::class);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    Route::apiResource('plans', PlanController::class)->except(['index', 'show']);
    Route::apiResource('schedules', SchedulesController::class)->except(['index', 'show']);
});
Route::apiResource('products', ProductController::class)->only(['index', 'show']);
Route::apiResource('plans', PlanController::class)->only(['index', 'show']);
Route::apiResource('schedules', SchedulesController::class)->only(['index', 'show']);
