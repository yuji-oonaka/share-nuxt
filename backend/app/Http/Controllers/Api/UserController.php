<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Add 'email' to validation and increase name limit
            $validated = $request->validate([
                'firebase_uid' => 'required|string|unique:users,firebase_uid',
                'name'         => 'required|string|max:50', // Increase limit
                'email'        => 'required|string|email|unique:users,email',
            ]);


            $validated['password'] = Hash::make(Str::random(20));
            $validated['remember_token'] = Str::random(10);


            $user = User::create($validated);

            return response()->json($user, 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Failed to create user.'], 500);
        }
    }

    /**
     * Return the authenticated user.
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}