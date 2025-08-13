'use client';

import { useEffect, useState, useCallback } from 'react';
import apiClient from '@/app/lib/apiClient';
import { Post } from '@/types';
import { PostCard } from './components/PostCard';
import { Sidebar } from './components/Sidebar';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast'; // ◀◀◀ インポート

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { appUser } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await apiClient.get('/posts');
      setPosts(response.data);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 🔽 handleDeletePostを修正
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm('本当にこの投稿を削除しますか？')) {
      return;
    }

    const deletePromise = apiClient.delete(`/posts/${postId}`);

    toast.promise(deletePromise, {
      loading: '削除中...',
      success: '投稿を削除しました。',
      error: '削除に失敗しました。',
    });

    try {
      await deletePromise;
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error('投稿の削除に失敗しました:', err);
    }
  };

  // 🔽 handleToggleLikeを修正
  const handleToggleLike = async (postId: number) => {
    if (!appUser) return;

    // 画面の状態を先に更新
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likes.some(
            (like) => like.user_id === appUser.id
          );
          if (isLiked) {
            return {
              ...post,
              likes_count: post.likes_count - 1,
              likes: post.likes.filter(
                (like) => like.user_id !== appUser.id
              ),
            };
          } else {
            return {
              ...post,
              likes_count: post.likes_count + 1,
              likes: [
                ...post.likes,
                { id: 0, user_id: appUser.id, post_id: postId },
              ],
            };
          }
        }
        return post;
      })
    );

    try {
      await apiClient.post(`/posts/${postId}/like`);
    } catch (err) {
      console.error('いいねの処理に失敗しました:', err);
      toast.error('いいねに失敗しました。'); // 失敗時のみ通知
      fetchPosts();
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar onPostSuccess={fetchPosts} />
      <main className="flex-1">
        <div className="border-l border-r border-gray-700 min-h-screen">
          <h1 className="text-xl font-bold text-white p-4 border-b border-gray-700">
            ホーム
          </h1>
          <div>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDelete={handleDeletePost}
                onToggleLike={handleToggleLike}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}