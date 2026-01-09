<?php

namespace Database\Seeders;

use App\Models\TimeSlot;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Ramsey\Uuid\Type\Time;

class TimeSlotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Make a seeder that creates a TimeSlot for each hour of the day (24 hours)
        // example: TimeSlot::create([
        //    'hour' => '08:00',
        //]);
        TimeSlot::create([
            'hour' => '00:00',
        ]);
        TimeSlot::create([
            'hour' => '01:00',
        ]);
        TimeSlot::create([
            'hour' => '02:00',
        ]);
        TimeSlot::create([
            'hour' => '03:00',
        ]);
        TimeSlot::create([
            'hour' => '04:00',
        ]);
        TimeSlot::create([
            'hour' => '05:00',
        ]);
        TimeSlot::create([
            'hour' => '06:00',
        ]);
        TimeSlot::create([
            'hour' => '07:00',
        ]);
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
        TimeSlot::create([
            'hour' => '13:00',
        ]);
        TimeSlot::create([
            'hour' => '14:00',
        ]);
        TimeSlot::create([
            'hour' => '15:00',
        ]);
        TimeSlot::create([
            'hour' => '16:00',
        ]);
        TimeSlot::create([
            'hour' => '17:00',
        ]);
        TimeSlot::create([
            'hour' => '18:00',
        ]);
        TimeSlot::create([
            'hour' => '19:00',
        ]);
        TimeSlot::create([
            'hour' => '20:00',
        ]);
        TimeSlot::create([
            'hour' => '21:00',
        ]);
        TimeSlot::create([
            'hour' => '22:00',
        ]);
        TimeSlot::create([
            'hour' => '23:00',
        ]);
    }
}
