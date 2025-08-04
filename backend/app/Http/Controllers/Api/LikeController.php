<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function toggleLike(Request $request, Post $post)
    {
        $user = $request->user();

        // 既にいいねしているか確認
        $like = $post->likes()->where('user_id', $user->id)->first();

        if ($like) {
            // いいねがあれば削除（いいね解除）
            $like->delete();
            $message = 'いいねを取り消しました。';
        } else {
            // いいねがなければ作成（いいねする）
            $post->likes()->create(['user_id' => $user->id]);
            $message = 'いいねしました。';
        }

        // 投稿に紐づくいいねの総数を返す
        return response()->json([
            'message' => $message,
            'likes_count' => $post->likes()->count(),
        ]);
    }
}