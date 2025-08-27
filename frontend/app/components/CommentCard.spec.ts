import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import CommentCard from "./CommentCard.vue";
import type { Comment } from "~/app/types";

// ▼▼▼ コンポーネント内で呼び出されている関数をグローバルにモックします ▼▼▼
// 今回のテストでは使われませんが、定義だけはしておく必要があります。
const useUserStore = vi.fn(() => ({}));
const usePostsStore = vi.fn(() => ({}));
vi.stubGlobal("useUserStore", useUserStore);
vi.stubGlobal("usePostsStore", usePostsStore);
// ▲▲▲ ここまで ▲▲▲

describe("CommentCard.vue", () => {
  // テストで使用する偽のコメントデータを用意します
  const mockComment: Comment = {
    id: 101,
    post_id: 1,
    user_id: 2,
    content: "これはテストコメントです。",
    user: {
      id: 2,
      name: "コメント投稿者",
      email: "commenter@example.com",
    },
    created_at: "2025-08-24T23:30:00.000000Z",
    updated_at: "2025-08-24T23:30:00.000000Z",
  };

  it("コメントの投稿者名と内容を正しく表示する", () => {
    // 1. 準備： 偽のデータを使ってコンポーネントを描画
    const wrapper = mount(CommentCard, {
      props: {
        comment: mockComment,
        postId: 1, // propsで必要なので渡します
      },
    });

    // 2. 確認： 描画されたテキストに、偽のデータの内容が含まれているかチェック
    expect(wrapper.text()).toContain(mockComment.user.name);
    expect(wrapper.text()).toContain(mockComment.content);
  });
});
