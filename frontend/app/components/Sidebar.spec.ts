import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises, RouterLinkStub } from "@vue/test-utils";
import Sidebar from "./Sidebar.vue";
import { defineRule } from "vee-validate";
import { required, max } from "@vee-validate/rules";

// ---------------------------------------------------------------------------
// Mocks (モック) の設定
// ---------------------------------------------------------------------------

// VeeValidateのルールをテスト用に定義
defineRule("required", required);
defineRule("max", max);

// モック関数を定義
const mockToast = { success: vi.fn(), error: vi.fn() };
const mockLogOut = vi.fn();
const mockSetUser = vi.fn();
const mockCreatePost = vi.fn().mockResolvedValue({});
const mockRouterPush = vi.fn();

// ★★★ useToastだけをvi.mockで指定 ★★★
vi.mock("vue-toastification", () => ({
  useToast: () => mockToast,
}));

// ★★★ Nuxtの自動インポート関数はvi.stubGlobalでモック ★★★
vi.stubGlobal("useAuth", vi.fn(() => ({ logOut: mockLogOut })));
vi.stubGlobal("useUserStore", vi.fn(() => ({ setUser: mockSetUser })));
vi.stubGlobal("usePostsStore", vi.fn(() => ({ createPost: mockCreatePost })));
vi.stubGlobal("useRouter", vi.fn(() => ({ push: mockRouterPush })));

// ---------------------------------------------------------------------------
// Tests (テスト) の記述
// ---------------------------------------------------------------------------

describe("Sidebar.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("主要な要素（ホーム、ログアウト、投稿フォーム）を正しく表示する", () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });
    expect(wrapper.text()).toContain("ホーム");
    expect(wrapper.text()).toContain("ログアウト");
    expect(wrapper.text()).toContain("シェアする");
    expect(wrapper.find("textarea").exists()).toBe(true);
  });

  it("ログアウトボタンをクリックすると、ログアウト処理が実行され、ログインページに遷移する", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });

    const logoutButton = wrapper.findAll("button").find((btn) => btn.text().includes("ログアウト"));
    await logoutButton?.trigger("click");
    await flushPromises();

    // 検証
    expect(mockLogOut).toHaveBeenCalled();
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(mockToast.success).toHaveBeenCalledWith("ログアウトしました");
    expect(mockRouterPush).toHaveBeenCalledWith("/login");
  });

  it("テキストを入力してシェアボタンをクリックすると、投稿処理が実行され、テキストエリアがクリアされる", async () => {
    const wrapper = mount(Sidebar, {
      global: {
        stubs: { NuxtLink: RouterLinkStub },
      },
    });
    const testContent = "新しい投稿のテストです";
    const textarea = wrapper.find("textarea");
    await textarea.setValue(testContent);
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // 結果を確認
    expect(mockCreatePost).toHaveBeenCalledWith(testContent);
    expect((textarea.element as HTMLTextAreaElement).value).toBe("");
  });
});