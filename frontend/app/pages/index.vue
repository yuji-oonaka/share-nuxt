<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

useHead({
  title: 'ホーム', // このページのタイトルを「ホーム」に設定
});

definePageMeta({
    middleware: 'auth'
});

const postsStore = usePostsStore();
// ストアのstateをリアクティブに保ったまま分割代入
const { posts } = storeToRefs(postsStore);

// コンポーネントがマウントされたら投稿を取得
onMounted(() => {
    postsStore.fetchPosts();
});

// 投稿削除の処理もストアのアクションを呼び出すように変更（将来的に）
function handlePostDeleted(deletedPostId: number) {
    // postsStore.deletePost(deletedPostId); のような形になる
    // 一旦、手動で配列から削除
    posts.value = posts.value.filter(post => post.id !== deletedPostId);
}
</script>

<template>
    <div>
        <header class="sticky top-0 bg-slate-900/80 backdrop-blur-md z-10">
            <h1 class="text-xl font-bold p-4 border-b border-slate-700">ホーム</h1>
        </header>
        <div>
            <PostCard v-for="post in posts" :key="post.id" :post="post" @postDeleted="handlePostDeleted" />
        </div>
    </div>
</template>