import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePostsStore } from "./posts"; // テスト対象のストア
import type { Post } from "~/app/types";

// ----- 依存関係のモック -----
// useApiFetchをモック化して、テストごとに異なる応答を返せるようにします
const useApiFetch: vi.Mock = vi.fn();
vi.stubGlobal("useApiFetch", useApiFetch);

// useUserStoreもモック化します
const useUserStore: vi.Mock = vi.fn();
vi.stubGlobal("useUserStore", useUserStore);
// -------------------------

describe("Posts Store", () => {
  const mockUser = { id: 1, name: "テストユーザー" };

  // 各テストの前にPiniaとモックを初期化します
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks(); // 各テストが独立するように、モックの呼び出し履歴をリセット
    useUserStore.mockReturnValue({ user: mockUser });
  });

  it("初期状態ではpostsは空の配列である", () => {
    const store = usePostsStore();
    expect(store.posts).toEqual([]);
  });

  describe("fetchPosts アクション", () => {
    it("APIから投稿配列を取得し、stateを正しく更新する", async () => {
      const store = usePostsStore();
      const mockPosts: Post[] = [{ id: 1, content: "投稿1" } as Post];

      // APIが投稿配列を返すように設定
      useApiFetch.mockResolvedValue(mockPosts);

      await store.fetchPosts();

      expect(useApiFetch).toHaveBeenCalledWith("/posts");
      expect(store.posts).toEqual(mockPosts);
    });
  });

  describe("createPost アクション", () => {
    it("新しい投稿を作成し、likesやcommentsを初期化してstateの先頭に追加する", async () => {
      const store = usePostsStore();
      const newPost: Post = { id: 2, content: "新しい投稿" } as Post;

      useApiFetch.mockResolvedValue(newPost);

      await store.createPost("新しい投稿");

      expect(useApiFetch).toHaveBeenCalledWith("/posts", {
        method: "POST",
        body: { content: "新しい投稿" },
      });

      expect(store.posts).toHaveLength(1);
      // createPostアクション内で初期化されるプロパティを検証
      expect(store.posts[0]).toEqual({
        ...newPost,
        likes: [],
        likes_count: 0,
        comments: [],
        comments_count: 0,
      });
    });
  });

  // 修正点: 新しいtoggleLikeのロジックに合わせてテストを全面的に書き換え
  describe("toggleLike アクション", () => {
    it("APIを呼び出し、応答として返ってきた最新のいいね数でstateを更新する", async () => {
      // --- 準備 ---
      const store = usePostsStore();
      const initialPost: Post = {
        id: 1,
        content: "テスト投稿",
        likes: [],
        likes_count: 0,
      } as Post;
      store.posts = [initialPost]; // ストアの初期状態を設定

      // APIモックの準備：APIは新しいいいね数を返す
      const apiResponse = { likes_count: 1 };
      useApiFetch.mockResolvedValue(apiResponse);

      // --- 実行 ---
      await store.toggleLike(1);

      // --- 検証 ---
      // 1. 正しいエンドポイントがPOSTメソッドで呼び出されたか
      expect(useApiFetch).toHaveBeenCalledWith("/posts/1/like", {
        method: "POST",
      });

      // 2. ストアの投稿データのいいね数が、APIの応答と同じ値に更新されたか
      expect(store.posts[0].likes_count).toBe(apiResponse.likes_count);

      // 3. likes配列に自分のIDが追加されたか（ハートの色を変えるために必要）
      expect(
        store.posts[0].likes.some((like) => like.user_id === mockUser.id)
      ).toBe(true);
    });

    it("いいね済みの投稿のいいねを解除する", async () => {
      // --- 準備 ---
      const store = usePostsStore();
      const initialPost: Post = {
        id: 1,
        content: "テスト投稿",
        likes: [{ id: 1, user_id: mockUser.id, post_id: 1 }],
        likes_count: 1,
      } as Post;
      store.posts = [initialPost];

      // APIモックの準備：いいね解除後はいいね数が0になる
      const apiResponse = { likes_count: 0 };
      useApiFetch.mockResolvedValue(apiResponse);

      // --- 実行 ---
      await store.toggleLike(1);

      // --- 検証 ---
      expect(store.posts[0].likes_count).toBe(0); // APIの応答通り0になる
      expect(store.posts[0].likes).toHaveLength(0); // likes配列から自分のIDが消える
    });

    it("API呼び出しが失敗した場合、stateは変更されない", async () => {
      // --- 準備 ---
      const store = usePostsStore();
      const initialPost: Post = {
        id: 1,
        likes: [],
        likes_count: 0,
      } as Post;
      store.posts = [initialPost];

      // APIモックの準備：API呼び出しが失敗する
      useApiFetch.mockRejectedValue(new Error("API Error"));
      const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

      // --- 実行 ---
      await store.toggleLike(1);

      // --- 検証 ---
      // stateが元の状態から変更されていないことを確認
      expect(store.posts[0].likes_count).toBe(0);
      expect(store.posts[0].likes).toHaveLength(0);
      // 失敗アラートが表示されたか確認
      expect(alertSpy).toHaveBeenCalledWith("いいねに失敗しました。");

      alertSpy.mockRestore(); // スパイを元に戻す
    });
  });

  // 修正点: 新しいdeleteCommentのロジックに合わせてテストを書き換え
  describe("deleteComment アクション", () => {
    it("コメントを削除し、APIから最新の投稿データを取得してstateを更新する", async () => {
      // --- 準備 ---
      const store = usePostsStore();
      const initialPost: Post = {
        id: 1,
        comments: [
          { id: 101, content: "コメント1" },
          { id: 102, content: "コメント2" },
        ],
        comments_count: 2,
      } as unknown as Post;
      store.posts = [initialPost];

      // 削除後の新しい投稿データ
      const updatedPost: Post = {
        id: 1,
        comments: [{ id: 102, content: "コメント2" }],
        comments_count: 1,
      } as unknown as Post;

      // APIモックの準備
      // 1回目の呼び出し (DELETE) は成功を返す
      useApiFetch.mockResolvedValueOnce({});
      // 2回目の呼び出し (GET) は更新後の投稿データを返す
      useApiFetch.mockResolvedValueOnce(updatedPost);

      // --- 実行 ---
      await store.deleteComment(1, 101);

      // --- 検証 ---
      // 1. コメント削除APIが呼ばれたか
      expect(useApiFetch).toHaveBeenCalledWith("/comments/101", {
        method: "DELETE",
      });
      // 2. 投稿データ取得APIが呼ばれたか
      expect(useApiFetch).toHaveBeenCalledWith("/posts/1");
      // 3. ストアの投稿データが、APIから返された最新のものに置き換わったか
      expect(store.posts[0]).toEqual(updatedPost);
    });
  });
});
