<?php

use App\Http\Controllers\ClassScheduleTimeslotController;
use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
Route::get('testing', [TestController::class, 'index'])->name('testing');
Route::post('/testing/timeslot', [ClassScheduleTimeslotController::class, 'store'])->name('testing.timeslot.store');
Route::get('/testing/timeslot/create', [ClassScheduleTimeslotController::class, 'create'])->name('testing.timeslot.create');

require __DIR__.'/auth.php';
