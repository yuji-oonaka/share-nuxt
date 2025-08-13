import axios from 'axios';
import { auth } from './firebase'; // 作成済みのFirebase authインスタンス

// バックエンドAPIのベースURL
const API_URL = 'http://localhost/api';

// axiosのインスタンスを作成
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// リクエストを送る「前」の共通処理
apiClient.interceptors.request.use(
  async (config) => {
    // 現在ログインしているFirebaseユーザーを取得
    const user = auth.currentUser;

    if (user) {
      // ユーザーがいれば、IDトークンを取得
      const token = await user.getIdToken(true);
      // リクエストヘッダーにトークンをセット
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;