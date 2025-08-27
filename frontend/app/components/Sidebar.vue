<script setup lang="ts">
import { ref } from 'vue';
// Nuxtの自動インポート機能により、以下のストアやコンポーザブルはimport不要です

const postContent = ref('');

// 必要な機能を使えるように準備
const { logOut } = useAuth();
const userStore = useUserStore();
const postsStore = usePostsStore();
const router = useRouter();

// ログアウト処理
const handleLogout = async () => {
    try {
        await logOut();
        userStore.setUser(null);
        alert('ログアウトしました。');
        router.push('/login');
    } catch (error) {
        console.error('ログアウトに失敗しました', error);
        alert('ログアウトに失敗しました。');
    }
};

// 投稿処理
const handlePostSubmit = async () => {
    if (!postContent.value.trim()) return;

    const newPost = await postsStore.createPost(postContent.value);

    // 安全のため初期化
    if (newPost) {
        newPost.likes = newPost.likes || [];
        newPost.likes_count = newPost.likes_count ?? 0;
        newPost.comments = newPost.comments || [];
        newPost.comments_count = newPost.comments_count ?? 0;
    }

    postContent.value = '';
};
</script>

<template>
    <div class="space-y-6">
        <NuxtLink to="/">
            <img src="/images/logo.png" alt="SHARE" class="h-8">
        </NuxtLink>

        <nav class="space-y-2">
            <NuxtLink to="/" class="flex items-center space-x-3 p-3 rounded-full hover:bg-slate-800 transition-colors">
                <img src="/images/home.png" alt="Home" class="w-6 h-6">
                <span class="text-xl">ホーム</span>
            </NuxtLink>
            <button @click="handleLogout"
                class="flex items-center space-x-3 p-3 rounded-full hover:bg-slate-800 transition-colors w-full">
                <img src="/images/logout.png" alt="Logout" class="w-6 h-6">
                <span class="text-xl">ログアウト</span>
            </button>
        </nav>

        <form @submit.prevent="handlePostSubmit" class="space-y-4">
            <textarea v-model="postContent" placeholder="いまどうしてる？"
                class="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-purple-500 focus:border-purple-500"></textarea>
            <div className="mt-3 flex justify-end">
                <button type="submit"
                    class="bg-[#7B61FF] text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity">
                    シェアする
                </button>
            </div>
        </form>
    </div>
</template>