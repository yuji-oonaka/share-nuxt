<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    /**
     * 投稿の一覧を取得する
     */
    public function index() // ◀◀◀ このメソッドを追加
    {
        // ユーザー情報も一緒に、新しい順で全件取得
        $posts = Post::with('user')->latest()->get();
        return response()->json($posts);
    }

    /**
     * 新しい投稿を保存する
     */
    public function store(Request $request)
    {
        try {
            // バリデーション
            $validated = $request->validate([
                'content' => 'required|string|max:120',
            ]);

            // 投稿を作成
            // ログインしているユーザーのIDをuser_idとして保存
            $post = $request->user()->posts()->create([
                'content' => $validated['content'],
            ]);

            return response()->json($post, 201);

        } catch (ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => '投稿に失敗しました。'], 500);
        }
    }
}