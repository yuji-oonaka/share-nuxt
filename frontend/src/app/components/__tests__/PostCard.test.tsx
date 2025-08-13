import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '../PostCard';
import { Post } from '@/types';
import '@testing-library/jest-dom';
import { useAuth } from '@/app/context/AuthContext';

// AuthContextモジュール全体をモック化し、useAuthをモック関数に置き換える
jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// 型安全のために、モック化したuseAuthをキャストする
const mockedUseAuth = useAuth as jest.Mock;

describe('PostCardコンポーネント', () => {
  const mockPost: Post = {
    id: 1,
    user_id: 1,
    content: 'これはテスト投稿の本文です。',
    user: {
      id: 1,
      name: 'テストユーザー',
      firebase_uid: 'author-uid-123',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    likes_count: 5,
    comments_count: 2,
    likes: [],
  };

  // 各テストの前にモックをリセットする（テスト間の影響を防ぐため）
  beforeEach(() => {
    mockedUseAuth.mockClear();
  });

  it('ユーザー名と投稿内容が正しく表示されること', () => {
    mockedUseAuth.mockReturnValue({ firebaseUser: { uid: 'any-user-uid' } });
    render(<PostCard post={mockPost} onDelete={() => {}} onToggleLike={() => {}} />);
    expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    expect(screen.getByText('これはテスト投稿の本文です。')).toBeInTheDocument();
  });

  it('いいねボタンがクリックされたらonToggleLike関数が呼ばれること', () => {
    mockedUseAuth.mockReturnValue({ firebaseUser: { uid: 'any-user-uid' } });
    const mockOnToggleLike = jest.fn();
    render(<PostCard post={mockPost} onDelete={() => {}} onToggleLike={mockOnToggleLike} />);
    const likeButton = screen.getByText('5').closest('button');
    if (likeButton) fireEvent.click(likeButton);
    expect(mockOnToggleLike).toHaveBeenCalledTimes(1);
  });

  describe('削除ボタンの表示', () => {
    it('ログインユーザーが投稿者の場合、削除ボタンが表示されること', () => {
      mockedUseAuth.mockReturnValue({ firebaseUser: { uid: 'author-uid-123' } });
      render(<PostCard post={mockPost} onDelete={() => {}} onToggleLike={() => {}} />);
      const deleteButton = screen.getByRole('button', { name: /削除/i });
      expect(deleteButton).toBeInTheDocument();
    });

    it('ログインユーザーが投稿者でない場合、削除ボタンが表示されないこと', () => {
      mockedUseAuth.mockReturnValue({ firebaseUser: { uid: 'another-user-uid-456' } });
      render(<PostCard post={mockPost} onDelete={() => {}} onToggleLike={() => {}} />);
      const deleteButton = screen.queryByRole('button', { name: /削除/i });
      expect(deleteButton).not.toBeInTheDocument();
    });
  });
});