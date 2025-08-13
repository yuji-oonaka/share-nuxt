'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/app/lib/apiClient';
import { Post, Comment } from '@/types';
import { Sidebar } from '@/app/components/Sidebar';
import toast from 'react-hot-toast';

// 1件の投稿を表示するためのシンプルなカード
const SinglePostCard = ({ post }: { post: Post }) => (
  <div className="border-b border-gray-700 p-4 text-white">
    <p className="font-bold">{post.user.name}</p>
    <p className="mt-2 text-xl whitespace-pre-wrap">{post.content}</p>
    <p className="text-gray-400 text-sm mt-2">
      {new Date(post.created_at).toLocaleString('ja-JP')}
    </p>
  </div>
);

const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchPostAndComments = async () => {
    if (!postId) return;
    try {
      const postRes = await apiClient.get(`/posts/${postId}`);
      setPost(postRes.data);
      setComments(postRes.data.comments);
    } catch (error) {
      console.error("投稿の取得に失敗しました:", error);
    }
  };

  useEffect(() => {
    fetchPostAndComments();
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentPromise = apiClient.post(`/posts/${postId}/comments`, {
      content: newComment,
    });

    toast.promise(commentPromise, {
        loading: 'コメントを投稿中...',
        success: 'コメントしました！',
        error: 'コメントに失敗しました。',
    });

    try {
        const response = await commentPromise;
        setComments([...comments, response.data]);
        setNewComment('');
    } catch (error) {
        console.error("コメント投稿エラー:", error);
    }
  };

  if (!post) return <div className="text-white">読み込み中...</div>;

  return (
    <div className="flex w-full min-h-screen">
      <Sidebar onPostSuccess={fetchPostAndComments} />
      <main className="flex-1">
        <div className="border-l border-r border-gray-700 min-h-screen">
          <h1 className="text-xl font-bold text-white p-4 border-b border-gray-700">
            コメント
          </h1>
          <SinglePostCard post={post} />
          {/* コメント投稿フォーム */}
          <div className="p-4 border-b border-gray-700">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="コメントを追加..."
                className="flex-1 p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none"
              />
              <button type="submit" className="bg-purple-600 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-700">
                コメント
              </button>
            </form>
          </div>
          {/* コメント一覧 */}
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border-b border-gray-700 text-white">
                <p className="font-bold">{comment.user.name}</p>
                <p className="mt-1">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;