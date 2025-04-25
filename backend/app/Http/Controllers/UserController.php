<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        $data = [
            'users' => $users,
            'status' => 200
        ];
        return response()->json($data);
    }

    public function roles()
    {
        $roles = Role::all();
        $data = [
            'roles' => $roles,
            'status' => 200
        ];
        return response()->json($data);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);
        $user->roles()->sync($request->roles);
        $data = [
            'user' => $user,
            'status' => 200
        ];
        return response()->json($data);
    }
}
