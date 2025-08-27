// ユーザー
export interface User {
  id: number;
  name: string;
  firebase_uid: string;
  created_at: string;
  updated_at: string;
}

// いいね
export interface Like {
  id: number;
  user_id: number;
  post_id: number;
}

// コメント
export interface Comment {
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  user: User;
  created_at: string;
}

// 投稿
export interface Post {
  id: number;
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  likes: Like[]; // この投稿のいいねの配列
  comments: Comment[];
  likes_count: number;
  comments_count: number;
  is_commented_by_current_user?: boolean;
}
