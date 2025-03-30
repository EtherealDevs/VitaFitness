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
            'name' => 'Branch A',
            'address' => 'Av. Independencia 1234'
        ]);
        Branch::create([
            'name' => 'Branch B',
            'address' => 'Salta 9876'
        ]);
    }
}
