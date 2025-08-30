import { mount, flushPromises } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent } from "vue";
import PostCard from "./PostCard.vue";
import type { Post } from "~/app/types";

// ----- グローバルモック -----
const mockUserStore = {
  user: { id: 1, name: "テストユーザー" },
};
const mockPostsStore = {
  posts: [] as Post[],
  toggleLike: vi.fn(),
};
const mockToast = { success: vi.fn(), error: vi.fn() };
const mockNavigateTo = vi.fn();

vi.stubGlobal("useUserStore", () => mockUserStore);
vi.stubGlobal("usePostsStore", () => mockPostsStore);
vi.stubGlobal("useToast", () => mockToast); // ★ useToast を返す
vi.stubGlobal("navigateTo", mockNavigateTo);

const mockUseApiFetch = vi.fn();
vi.stubGlobal("useApiFetch", mockUseApiFetch);
vi.mock("vue-toastification", () => ({
  useToast: () => mockToast,
}));
// -------------------------

// ----- テストデータ -----
const mockPost: Post = {
  id: 10,
  user_id: 1,
  content: "これはテスト投稿です。",
  user: { id: 1, name: "テスト投稿者" },
  likes: [{ user_id: 1, post_id: 10 }],
  comments: [{ user_id: 1, post_id: 10 }],
  likes_count: 5,
  comments_count: 3,
  created_at: new Date().toISOString(),
};
// -------------------------

// NuxtLink stub
const NuxtLinkStub = defineComponent({
  template: "<a><slot /></a>",
});

describe("PostCard.vue コンポーネントテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPostsStore.posts = [];
  });

  const createWrapper = (postData: Post) => {
    return mount(PostCard, {
      props: { post: postData },
      global: {
        stubs: { NuxtLink: NuxtLinkStub },
      },
    });
  };

  it("投稿の著者名、内容、いいね数、コメント数を正しく表示する", () => {
    const wrapper = createWrapper(mockPost);
    const text = wrapper.text();
    expect(text).toContain("テスト投稿者");
    expect(text).toContain("これはテスト投稿です。");
    expect(text).toContain("5"); // いいね
    expect(text).toContain("3"); // コメント
  });

  it("ログインユーザーが投稿者の場合、削除ボタンを表示する", () => {
    const wrapper = createWrapper(mockPost);
    const deleteButton = wrapper.find("[data-testid='delete-button']");
    expect(deleteButton.exists()).toBe(true);
  });

  it("ログインユーザーが投稿者でない場合、削除ボタンを非表示にする", () => {
    const postFromAnotherUser = { ...mockPost, user_id: 2 };
    const wrapper = createWrapper(postFromAnotherUser);
    const deleteButton = wrapper.find("[data-testid='delete-button']");
    expect(deleteButton.exists()).toBe(false);
  });

  it("削除ボタンをクリックすると、API呼び出し・store更新・toast・navigateTo が実行される", async () => {
    const wrapper = createWrapper(mockPost);
    const deleteButton = wrapper.find("[data-testid='delete-button']");

    // confirm を常に OK にする
    vi.stubGlobal("confirm", () => true);

    // useApiFetch のモックが resolved するようにする
    mockUseApiFetch.mockResolvedValueOnce({ success: true });

    // postsStore に対象投稿を追加
    mockPostsStore.posts = [mockPost];

    await deleteButton.trigger("click");
    await flushPromises();

    // ✅ API が呼ばれる
    expect(mockUseApiFetch).toHaveBeenCalledWith(`/posts/10`, {
      method: "DELETE",
    });

    // ✅ store が更新されている
    expect(mockPostsStore.posts).not.toContain(mockPost);

    // ✅ toast が成功メッセージを表示
    expect(mockToast.success).toHaveBeenCalledWith("投稿を削除しました");

    // ✅ navigateTo が呼ばれる
    expect(mockNavigateTo).toHaveBeenCalledWith("/");
  });


  it("いいねボタンをクリックすると、storeのtoggleLikeアクションが呼ばれる", async () => {
    const wrapper = createWrapper(mockPost);
    const likeButton = wrapper.find("button[aria-label='いいね']");
    await likeButton.trigger("click");
    expect(mockPostsStore.toggleLike).toHaveBeenCalledWith(10);
  });

  it("ユーザーがいいね済みの場合、いいねボタンとカウントが強調表示される", () => {
    const wrapper = createWrapper(mockPost);
    const likeButton = wrapper.find("button[aria-label='いいね']");
    expect(likeButton.classes()).toContain("text-pink-500");
  });
});
