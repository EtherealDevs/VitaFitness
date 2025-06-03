<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Contracts\Role as ContractsRole;
use Spatie\Permission\Models\Role as ModelsRole;

class RoleController extends Controller
{
    public function index()
    {
        $roles = ModelsRole::all();
        $roles = $roles->where('guard_name', 'api');
        $rolesResources = ResourceCollection::make($roles);
        return response()->json([
            'roles' => $rolesResources,
        ]);
    }
    public function syncRoles(Request $request)
    {
        $user_id = $request->user_id;
        $role_name = $request->role_name;
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_name' => 'required',
        ]);
        $role = ModelsRole::findByName($role_name, 'api');
        $user = User::find($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'No se encontró el usuario',
            ], 404);
        }
        if (!$role) {
            return response()->json([
                'message' => 'No se encontró el rol',
            ], 404);
        }
        if ($user->name === env('ADMIN_NAME')) {
            return response()->json([
                'message' => 'No se puede cambiar el rol del usuario administrador',
            ], 403);
        }


        $user->roles()->sync($role);
        return response()->json([
            'message' => 'Roles actualizados',
            'user' => $user,
            'role' => $role,
        ]);
    }
}
