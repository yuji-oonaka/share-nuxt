<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Middleware\FirebaseAuthenticate; // ◀◀◀ 忘れずにuse

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Laravelデフォルトの認証ルート
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});-

// ユーザー登録（認証不要）
Route::post('/users', [UserController::class, 'store']);
// 投稿一覧取得（認証不要）
Route::get('/posts', [PostController::class, 'index']);

// 認証が必要なルート
Route::middleware(FirebaseAuthenticate::class)->group(function () {
    // 投稿作成
    Route::post('/posts', [PostController::class, 'store']);
});