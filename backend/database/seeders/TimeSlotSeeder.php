<?php

namespace Database\Seeders;

use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TimeSlot::create([
            'hour' => '08:00',
        ]);
        TimeSlot::create([
            'hour' => '09:00',
        ]);
        TimeSlot::create([
            'hour' => '10:00',
        ]);
        TimeSlot::create([
            'hour' => '11:00',
        ]);
        TimeSlot::create([
            'hour' => '12:00',
        ]);
    }
}
