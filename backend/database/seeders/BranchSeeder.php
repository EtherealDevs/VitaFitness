<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Branch::create([
            'name' => 'Sede Principal',
            'address' => 'Belgrano 2014'
        ]);
        Branch::create([
            'name' => 'Pilates 1',
            'address' => 'Av. Ferré 2067'
        ]);
        Branch::create([
            'name' => 'Pilates 2',
            'address' => 'Salta 1413'
        ]);
    }
}
