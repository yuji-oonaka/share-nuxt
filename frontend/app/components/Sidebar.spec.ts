import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";

import Sidebar from "./Sidebar.vue";

// このコンポーネントで使われるすべての自動インポート関数をモックします
const mockLogOut = vi.fn();
const mockSetUser = vi.fn();
const mockCreatePost = vi.fn();
const mockRouterPush = vi.fn();

const useAuth = vi.fn(() => ({ logOut: mockLogOut }));
const useUserStore = vi.fn(() => ({ setUser: mockSetUser }));
const usePostsStore = vi.fn(() => ({ createPost: mockCreatePost }));
const useRouter = vi.fn(() => ({ push: mockRouterPush }));

vi.stubGlobal("useAuth", useAuth);
vi.stubGlobal("useUserStore", useUserStore);
vi.stubGlobal("usePostsStore", usePostsStore);
vi.stubGlobal("useRouter", useRouter);

describe("Sidebar.vue", () => {
  // 各テストの前に、すべてのモックの呼び出し履歴をリセットします
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("主要な要素（ホーム、ログアウト、投稿フォーム）を正しく表示する", () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });

    // 重要な文言が表示されているかを確認
    expect(wrapper.text()).toContain("ホーム");
    expect(wrapper.text()).toContain("ログアウト");
    expect(wrapper.text()).toContain("シェアする");
    // テキストエリアが存在するかを確認
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("ログアウトボタンをクリックすると、ログアウト処理が実行され、ログインページに遷移する", async () => {
    // alertが呼ばれたことを確認するために、偽のalertを用意します
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });

    // ログアウトボタンを探してクリックします
    const logoutButton = wrapper
      .findAll("button")
      .find((btn) => btn.text().includes("ログアウト"));
    await logoutButton?.trigger("click");

    // 期待される関数が正しく呼ばれたかを確認します
    expect(mockLogOut).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(alertSpy).toHaveBeenCalledWith("ログアウトしました。");
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("テキストを入力してシェアボタンをクリックすると、投稿処理が実行され、テキストエリアがクリアされる", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });

    const testContent = "新しい投稿のテストです";

    // 1. テキストエリアに文字を入力します
    const textarea = wrapper.find("textarea");
    await textarea.setValue(testContent);

    // 2. フォームを送信します
    await wrapper.find("form").trigger("submit");

    // 3. 結果を確認します
    // postsStoreのcreatePostが正しい内容で呼ばれたか
    expect(mockCreatePost).toHaveBeenCalledWith(testContent);
    // テキストエリアが空になったか
    expect((textarea.element as HTMLTextAreaElement).value).toBe("");
  });
});
