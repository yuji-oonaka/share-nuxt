export type User = {
  id: number;
  name: string;
  firebase_uid: string;
  created_at: string;
  updated_at: string;
};

export type Like = {
  id: number;
  user_id: number;
  post_id: number;
};

export type Comment = {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  created_at: string;
  user: User; // コメントしたユーザーの情報
};

export type Post = {
  id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
  likes_count: number; // ◀◀◀ いいねの総数を追加
  likes: Like[];       // ◀◀◀ いいねしたユーザーの情報を追加
  comments_count: number; // ◀◀◀ コメントの総数を追加
};