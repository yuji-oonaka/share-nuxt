import { mount } from "@vue/test-utils";
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
vi.stubGlobal("useUserStore", () => mockUserStore);
vi.stubGlobal("usePostsStore", () => mockPostsStore);

const mockUseApiFetch = vi.fn();
vi.stubGlobal("useApiFetch", mockUseApiFetch);
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
// --------------------

// ★ 修正点: NuxtLinkのスタブをより現実に近い形に変更
const NuxtLinkStub = defineComponent({
  template: "<a><slot /></a>",
});

describe("PostCard.vue コンポーネントテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // ストアのposts配列をリセット
    mockPostsStore.posts = [];
  });

  // ★ 修正点: NuxtLinkStub を使用
  const createWrapper = (postData: Post) => {
    return mount(PostCard, {
      props: { post: postData },
      global: {
        stubs: {
          NuxtLink: NuxtLinkStub,
        },
      },
    });
  };

  it("投稿の著者名、内容、いいね数、コメント数を正しく表示する", () => {
    const wrapper = createWrapper(mockPost);
    const text = wrapper.text();
    expect(text).toContain("テスト投稿者");
    expect(text).toContain("これはテスト投稿です。");
    expect(text).toContain("5"); // いいね数
    expect(text).toContain("3"); // コメント数
  });

  it("ログインユーザーが投稿者の場合、削除ボタンを表示する", () => {
    const wrapper = createWrapper(mockPost);
    const deleteButton = wrapper.find("button[aria-label='削除']");
    expect(deleteButton.exists()).toBe(true);
  });

  it("ログインユーザーが投稿者でない場合、削除ボタンを非表示にする", () => {
    const postFromAnotherUser = { ...mockPost, user_id: 2 };
    const wrapper = createWrapper(postFromAnotherUser);
    const deleteButton = wrapper.find("button[aria-label='削除']");
    expect(deleteButton.exists()).toBe(false);
  });

  it("削除ボタンをクリックすると、APIが呼ばれ、storeから投稿が削除される", async () => {
    mockPostsStore.posts = [mockPost]; // ストアに投稿をセット
    const wrapper = createWrapper(mockPost);

    vi.spyOn(window, "confirm").mockReturnValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});

    const deleteButton = wrapper.find("button[aria-label='削除']");
    await deleteButton.trigger("click");

    expect(mockUseApiFetch).toHaveBeenCalledWith("/posts/10", {
      method: "DELETE",
    });
    expect(mockPostsStore.posts).toHaveLength(0);
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
