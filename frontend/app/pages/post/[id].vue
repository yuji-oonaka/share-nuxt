<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { Post } from "~/app/types";

useHead({ title: "投稿詳細" });
definePageMeta({ middleware: "auth" });

const route = useRoute();
const postsStore = usePostsStore();
const userStore = useUserStore();
const postId = Number(route.params.id);

const newComment = ref("");

// 🔹 store から投稿を直接参照
const post = computed<Post | undefined>(() =>
  postsStore.posts.find((p) => p.id === postId)
);

// 🔹 ログイン中ユーザーがいいね済みか
const isLikedByCurrentUser = computed(() => {
  if (!userStore.user || !post.value?.likes) return false;
  return post.value.likes.some(like => like.user_id === userStore.user!.id);
});

// 🔹 投稿詳細を取得（初回ロード）
const fetchPost = async () => {
  try {
    const fetchedPost = await useApiFetch<Post>(`/posts/${postId}`, {
      cache: "no-cache",
    });
    if (!fetchedPost) return;

    const index = postsStore.posts.findIndex(p => p.id === postId);

    if (index !== -1) {
      // store に既にある likes/likes_count は保持しつつコメントだけ更新
      const existing = postsStore.posts[index];
      postsStore.posts[index] = {
        ...fetchedPost,
        likes: existing.likes,
        likes_count: existing.likes_count,
      };
    } else {
      postsStore.posts.push(fetchedPost);
    }
  } catch (e) {
    console.error("投稿の取得に失敗", e);
  }
};

onMounted(fetchPost);

// 🔹 コメント逆順
const reversedComments = computed(() => {
  if (!post.value?.comments) return [];
  return [...post.value.comments].reverse();
});

// 🔹 コメント送信
const handleCommentSubmit = async () => {
  if (!post.value || !newComment.value.trim()) return;
  await postsStore.addComment(post.value.id, newComment.value);
  newComment.value = "";
  await fetchPost(); // store 更新
};

// 🔹 いいね切り替え
const handleToggleLike = async () => {
  if (!post.value) return;
  await postsStore.toggleLike(post.value.id);
  // store が更新されるので、computed が自動で反映
};

// 🔹 投稿削除
const handleDeletePost = async () => {
  if (!post.value) return;
  if (confirm("本当にこの投稿を削除しますか？")) {
    try {
      await useApiFetch(`/posts/${post.value.id}`, { method: "DELETE" });
      alert("投稿を削除しました");
      navigateTo("/");
    } catch (error) {
      console.error("投稿の削除に失敗しました", error);
      alert("投稿の削除に失敗しました。");
    }
  }
};
</script>

<template>
  <div>
    <div v-if="post">
      <div>
        <h1 class="text-xl font-bold text-white p-4 border-b border-gray-700">コメント</h1>

        <div class="p-4 text-white border-b border-gray-700">
          <div class="flex items-center gap-4">
            <p class="font-bold">{{ post.user.name }}</p>
            <div class="flex items-center gap-3">
              <!-- いいね -->
              <button
                @click="handleToggleLike"
                class="flex items-center gap-1 transition-transform duration-200"
                :class="isLikedByCurrentUser ? 'text-pink-500' : 'text-white hover:text-pink-500 hover:scale-110'"
              >
                <img src="/images/heart.png" alt="いいね" class="w-[18px] h-[18px]" />
                <span :class="{ 'text-pink-500 font-bold': isLikedByCurrentUser }">
                  {{ post.likes_count || 0 }}
                </span>
              </button>

              <!-- 投稿削除 -->
              <button
                v-if="userStore.user?.id === post.user_id"
                @click="handleDeletePost"
                class="cursor-pointer hover:scale-110 transition-transform duration-200"
              >
                <img src="/images/cross.png" alt="削除" class="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          <p class="mt-2 whitespace-pre-wrap">{{ post.content }}</p>
          <p class="text-gray-400 text-sm mt-2">
            {{ new Date(post.created_at).toLocaleString("ja-JP") }}
          </p>
        </div>
      </div>

      <!-- コメント -->
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-white font-bold text-lg text-center">コメント</h2>
      </div>

      <div>
        <CommentCard
          v-for="comment in reversedComments"
          :key="comment.id"
          :comment="comment"
          :postId="post.id"
        />
      </div>

      <div class="p-4">
        <form @submit.prevent="handleCommentSubmit">
          <input
            v-model="newComment"
            placeholder="コメントを入力"
            class="w-full p-2 rounded-lg bg-slate-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div class="flex justify-end mt-2">
            <button
              type="submit"
              class="bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-purple-600 active:bg-purple-700 border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transform transition-all duration-150 focus:outline-none"
            >
              コメント
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="p-4 text-center">
      読み込み中...
    </div>
  </div>
</template>
