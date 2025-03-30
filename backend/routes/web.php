<?php

use App\Http\Controllers\TestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});
Route::get('testing', [TestController::class, 'index'])->name('testing');

require __DIR__.'/auth.php';
