import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // waitFor をインポート
import { Sidebar } from '../Sidebar';
import '@testing-library/jest-dom';
import apiClient from '@/app/lib/apiClient'; // apiClientをインポート

// useRouterフックをモック化
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// ★ apiClientをモック化し、postメソッドがPromiseを返すように設定
jest.mock('@/app/lib/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;


describe('Sidebarコンポーネント', () => {
  // 既存の2つのテストは変更なし...
  it('タイトルとナビゲーションリンクが正しく表示されること', () => {
    render(<Sidebar onPostSuccess={() => {}} />);
    expect(screen.getByAltText('SHARE Logo')).toBeInTheDocument();
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('ログアウト')).toBeInTheDocument();
  });

  it('テキストエリアに文字が入力できること', () => {
    render(<Sidebar onPostSuccess={() => {}} />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'こんにちは' } });
    expect(textarea.value).toBe('こんにちは');
  });

  // ★ フォーム送信テストの修正版
  it('文字を入力してシェアボタンを押すと、onPostSuccessが呼ばれること', async () => { // "async" を追加
    // postメソッドが成功したPromiseを返すように設定
    mockedApiClient.post.mockResolvedValue({});

    const mockOnPostSuccess = jest.fn();
    render(<Sidebar onPostSuccess={mockOnPostSuccess} />);

    const textarea = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: 'シェアする' });

    fireEvent.change(textarea, { target: { value: '新しい投稿です' } });
    fireEvent.click(submitButton);

    // ★ 非同期処理が完了するのを待つ
    await waitFor(() => {
      // onPostSuccess関数が1回呼ばれたことを確認
      expect(mockOnPostSuccess).toHaveBeenCalledTimes(1);
    });
  });
});