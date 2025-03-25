<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $accessAdmin = Permission::create(['name' => 'access admin']);

        $adminRole->givePermissionTo($accessAdmin);
        $admin = User::where('email', env('ADMIN_EMAIL'))->first();
        $admin->assignRole('admin');

        // Assign role to user
        $admin = User::where('name', '=', env('ADMIN_NAME'))->first();
        if (Hash::check(env('ADMIN_PASS'), $admin->password)) {
            $admin->assignRole('admin');
        }
    }
}
