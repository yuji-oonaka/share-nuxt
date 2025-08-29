import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { usePostsStore } from "./posts";
import { useUserStore } from "./user"; // toggleLikeのテストで必要
import type { Post } from "~/app/types";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
const useApiFetch = vi.fn();
vi.stubGlobal("useApiFetch", useApiFetch);

// useToast をモック
const mockToast = { success: vi.fn(), error: vi.fn() };
vi.mock("vue-toastification", () => ({
  useToast: () => mockToast,
}));

const mockUserStore = {
  user: null, // 初期状態は null
};
vi.stubGlobal(
  "useUserStore",
  vi.fn(() => mockUserStore)
);
// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("Posts Store", () => {
  let store: ReturnType<typeof usePostsStore>;
  let userStore: ReturnType<typeof useUserStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = usePostsStore();
    userStore = useUserStore(); // userStoreも初期化
    vi.clearAllMocks();
  });

  it("初期状態", () => {
    expect(store.posts).toEqual([]);
  });

  it("fetchPosts アクション", async () => {
    const mockPosts: Post[] = [
      { id: 1, content: "Post 1", user_id: 1, user: { id: 1, name: "user1" } },
    ];
    useApiFetch.mockResolvedValue(mockPosts);
    await store.fetchPosts();
    expect(useApiFetch).toHaveBeenCalledWith("/posts");
    expect(store.posts).toEqual(mockPosts);
  });

  it("createPost アクション", async () => {
    const newPost: Post = {
      id: 2,
      content: "New Post",
      user_id: 1,
      user: { id: 1, name: "user1" },
    };
    useApiFetch.mockResolvedValue(newPost);
    await store.createPost("New Post");
    expect(useApiFetch).toHaveBeenCalledWith("/posts", expect.any(Object));
    expect(store.posts[0]).toEqual(expect.objectContaining(newPost));
    expect(mockToast.success).toHaveBeenCalledWith("新規投稿しました");
  });

  describe("toggleLike アクション", () => {
    it("未ログイン時にエラーを出す", async () => {
      // 準備: userStoreを未ログイン状態にする
      mockUserStore.user = null;

      await store.toggleLike(1);

      expect(mockToast.error).toHaveBeenCalledWith(
        "いいねするにはログインが必要です。"
      );
    });

    it("成功時、stateを更新する", async () => {
      // 準備: userStoreをログイン状態にする
      mockUserStore.user = { id: 1, name: "user1", email: "a@a.com" };
      store.posts = [
        { id: 1, content: "Post 1", user_id: 1, likes: [], likes_count: 0 },
      ];
      useApiFetch.mockResolvedValue({ likes_count: 1 });

      await store.toggleLike(1);

      expect(store.posts[0].likes_count).toBe(1);
      expect(store.posts[0].likes).toHaveLength(1);
    });
  });

  it("addComment アクション", async () => {
    const updatedPost: Post = {
      id: 1,
      content: "Updated Post",
      user_id: 1,
      comments: [{ id: 1, content: "new comment" }],
    };
    useApiFetch.mockResolvedValue(updatedPost); // 2回目のAPI呼び出しのモック
    store.posts = [{ id: 1, content: "Original Post", user_id: 1 }];

    await store.addComment(1, "new comment");

    expect(mockToast.success).toHaveBeenCalledWith("コメントしました");
    expect(store.posts[0]).toEqual(expect.objectContaining(updatedPost));
  });
});
