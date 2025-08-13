'use client';

import { Post } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

type Props = {
  post: Post;
  onDelete: (postId: number) => void;
  onToggleLike: (postId: number) => void;
};

export const PostCard = ({ post, onDelete, onToggleLike }: Props) => {
  const { firebaseUser, appUser } = useAuth();

  // isLikedByMeは色の変更には使いませんが、将来的な拡張のために残しておいても良いでしょう。
  const isLikedByMe = appUser && post.likes?.some(
    (like) => like.user_id === appUser.id
  );

  return (
    <div className="border-b border-gray-700 p-4 text-white">
      {/* ユーザー情報とアイコンエリア */}
      <div className="flex items-center gap-4">
        <p className="font-bold">{post.user.name}</p>

        {/* アイコン群 */}
        <div className="flex items-center gap-3">
          {/* 1. いいねボタン */}
          <button
            onClick={() => onToggleLike(post.id)}
            className="flex cursor-pointer items-center gap-1 text-white hover:scale-110 transition-transform duration-200"
          >
            <Image
              src="/images/heart.png"
              alt="いいね"
              width={18}
              height={18}
            />
            {/* いいねの数を表示 */}
            <span>{post.likes_count > 0 ? post.likes_count : ''}</span>
          </button>

          {/* 2. 削除ボタン */}
          {firebaseUser?.uid === post.user.firebase_uid && (
            <button 
              onClick={() => onDelete(post.id)} 
              className="cursor-pointer hover:scale-110 transition-transform duration-200"
            >
              <Image src="/images/cross.png" alt="削除" width={18} height={18} />
            </button>
          )}
          
          {/* 3. コメントボタン */}
          <Link
            href={`/posts/${post.id}`}
            className="ml-3 flex items-center gap-1 text-white hover:scale-110 transition-transform duration-200"
          >
            <Image src="/images/detail.png" alt="コメント" width={18} height={18} />
            <span>{post.comments_count > 0 ? post.comments_count : ''}</span>
          </Link>
        </div>
      </div>

      {/* 投稿内容 */}
      <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
};