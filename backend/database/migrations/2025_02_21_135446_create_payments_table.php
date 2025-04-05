<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('classSchedule_id')->constrained('class_schedules');
            $table->foreignId('student_id')->constrained('students');
            $table->date('payment_date')->nullable();
            $table->decimal('amount', 8, 2);
            $table->enum('status', ['pagado', 'pendiente', 'rechazado'])->default('pendiente');
            $table->date('date_start');
            $table->date('expiration_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
