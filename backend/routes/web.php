<?php

use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ClassScheduleTimeslotController;
use App\Http\Controllers\TestController;
use App\Models\ClassSchedule;
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

require __DIR__.'/auth.php';
