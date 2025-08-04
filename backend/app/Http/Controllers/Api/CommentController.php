<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    // 特定投稿のコメント一覧を取得
    public function index(Post $post)
    {
        $comments = $post->comments()->with('user')->latest()->get();
        return response()->json($comments);
    }

    // 新しいコメントを保存
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate(['content' => 'required|string|max:120']);

        $comment = $post->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // 作成したコメントにユーザー情報を付加して返す
        return response()->json($comment->load('user'), 201);
    }
}