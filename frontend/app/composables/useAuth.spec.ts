import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref } from "vue";
import { useAuth } from "./useAuth";

// `firebase/auth`からインポートされるものをすべて偽の関数に置き換える
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

// Nuxtのコンポーザブルをモック化
const mockAuth = { name: "mock-auth" };
vi.stubGlobal(
  "useNuxtApp",
  vi.fn(() => ({ $auth: mockAuth }))
);
vi.stubGlobal(
  "useState",
  vi.fn((key, init) => ref(init()))
);

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

describe("useAuth Composable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("signUp: 正しい引数でcreateUserWithEmailAndPasswordを呼び出す", async () => {
    const { signUp } = useAuth();
    const email = "test@example.com";
    const password = "password123";
    await signUp(email, password);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      email,
      password
    );
  });

  it("logIn: 正しい引数でsignInWithEmailAndPasswordを呼び出す", async () => {
    const { logIn } = useAuth();
    const email = "test@example.com";
    const password = "password123";
    await logIn(email, password);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      mockAuth,
      email,
      password
    );
  });

  it("logOut: signOutを呼び出す", async () => {
    const { logOut } = useAuth();
    await logOut();
    expect(signOut).toHaveBeenCalledWith(mockAuth);
  });

  // ▼▼▼ このテストケースを修正しました ▼▼▼
  it("onAuthStateChanged: 認証状態の変更に応じてuser refを更新する", () => {

    const mockUser = { uid: "123", email: "test@example.com" };

    // まずuseAuth()を呼び出して、内部でonAuthStateChangedが実行されるようにする
    const { user } = useAuth();

    // onAuthStateChangedが呼ばれたときの引数を取得する
    // .mock.calls[0] は1回目の呼び出しを、[1]はその時の2番目の引数（コールバック関数）を指す
    const authCallback = (onAuthStateChanged as vi.Mock).mock.calls[0][1];

    // 取得したコールバック関数を手動で実行して、状態変化をシミュレートする
    // 1. ログイン状態をシミュレート
    authCallback(mockUser);
    expect(user.value).toEqual(mockUser);

    // 2. ログアウト状態をシミュレート
    authCallback(null);
    expect(user.value).toBeNull();
  });
  
});
