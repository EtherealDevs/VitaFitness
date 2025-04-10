<?php

use App\Http\Controllers\ClasseController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ClassScheduleTimeslotController;
use App\Http\Controllers\ClassScheduleTimeslotStudentController;
use App\Http\Controllers\TestController;
use App\Models\ClassSchedule;
use App\Models\ClassScheduleTimeslotStudent;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
Route::get('testing', [TestController::class, 'index'])->name('testing');
Route::post('/testing/classSchedule', [ClassScheduleController::class, 'store'])->name('testing.classSchedule.store');
Route::get('testing/classSchedule/index', [ClassScheduleController::class, 'index'])->name('testing.classSchedule.index');
Route::get('/testing/classSchedule/create', [ClassScheduleController::class, 'create'])->name('testing.classSchedule.create');
Route::get('/testing/classSchedule/{id}/edit', [ClassScheduleController::class, 'edit'])->name('testing.classSchedule.edit');
Route::post('/testing/classSchedule/{id}', [ClassScheduleController::class, 'update'])->name('testing.classSchedule.update');
Route::get('testing/class', [ClasseController::class, 'index'])->name('testing.class.index');
Route::get('testing/class/{id}/show', [ClasseController::class, 'show'])->name('testing.class.show');
Route::get('testing/class/create', [ClasseController::class, 'create'])->name('testing.class.create');
Route::get('testing/class/{id}/edit', [ClasseController::class, 'edit'])->name('testing.class.edit');
Route::post('testing/class/{id}', [ClasseController::class, 'update'])->name('testing.class.update');

Route::get('testing/classStudents/{id}/edit', [ClassScheduleTimeslotStudentController::class, 'edit'])->name('testing.class.students.edit');
Route::get('testing/classStudents/create', [ClassScheduleTimeslotStudentController::class, 'create'])->name('testing.class.students.create'); 
Route::post('testing/classStudents', [ClassScheduleTimeslotStudentController::class, 'store'])->name('testing.class.students.store');
Route::post('testing/classStudents/{id}', [ClassScheduleTimeslotStudentController::class, 'update'])->name('testing.class.students.update');


require __DIR__.'/auth.php';
