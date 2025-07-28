<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * ユーザー情報をDBに登録する
     */
    public function store(Request $request)
    {
        try {
            // バリデーションを実行
            $validated = $request->validate([
                'firebase_uid' => 'required|string|unique:users,firebase_uid',
                'name' => 'required|string|max:20',
            ]);

            $user = User::create($validated);

            // 成功したら、作成されたユーザー情報を201ステータスで返す
            return response()->json($user, 201);

        } catch (ValidationException $e) {
            // バリデーションエラーの場合は422を返す
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // その他のエラーログを出力
            Log::error($e->getMessage());
            // エラーレスポンスを返す
            return response()->json(['message' => 'ユーザーの作成に失敗しました。'], 500);
        }
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}