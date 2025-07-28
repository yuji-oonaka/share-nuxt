<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Middleware\FirebaseAuthenticate;

// ユーザー登録（認証不要）
Route::post('/users', [UserController::class, 'store']);

// 投稿一覧取得（認証不要）
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}/comments', [CommentController::class, 'index']);

// 認証が必要なルート
Route::middleware(FirebaseAuthenticate::class)->group(function () {
    // 投稿作成
    Route::post('/posts', [PostController::class, 'store']);
    // 投稿削除
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
    // いいねのトグル
    Route::post('/posts/{post}/like', [LikeController::class, 'toggleLike']);
    Route::get('/me', [UserController::class, 'me']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
});