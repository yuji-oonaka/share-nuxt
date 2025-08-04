<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Kreait\Firebase\Exception\Auth\FailedToVerifyToken;

class FirebaseAuthenticate
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. リクエストヘッダーからトークンを取得
        $token = $request->bearerToken();

        if (!$token) {
            // トークンがなければ401エラー
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            // 2. トークンを検証
            $verifiedIdToken = app('firebase.auth')->verifyIdToken($token);
        } catch (FailedToVerifyToken $e) {
            // トークンが無効なら401エラー
            return response()->json(['message' => 'Unauthorized: ' . $e->getMessage()], 401);
        }

        // 3. トークンからFirebaseのUIDを取得
        $uid = $verifiedIdToken->claims()->get('sub');

        // 4. UIDを使って、ローカルDBからユーザーを検索
        $user = User::where('firebase_uid', $uid)->first();

        if ($user) {
            // 5. ユーザーが見つかれば、このリクエスト中はそのユーザーとしてログインさせる
            Auth::login($user);
            return $next($request); // リクエストをコントローラーに渡す
        }

        // ユーザーが見つからなければ401エラー
        return response()->json(['message' => 'User not found in local database.'], 401);
    }
}