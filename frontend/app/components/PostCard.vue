<script setup lang="ts">
import { computed } from "vue";
import type { Post } from "~/app/types";

const props = defineProps<{
  post: Post;
}>();

const userStore = useUserStore();
const postsStore = usePostsStore();

// 🔹 ログイン中のユーザーがいいね済みかどうか
const isLikedByCurrentUser = computed(() => {
  if (!userStore.user) return false;
  return props.post.likes?.some(
    (like) => like.user_id === userStore.user!.id
  );
});

// 🔹 ログイン中のユーザーがコメントしているかどうか
const isCommentedByCurrentUser = computed(() => {
  if (!userStore.user) return false;
  return props.post.comments?.some(comment => comment.user_id === userStore.user.id);
});

// 🔹 投稿削除処理（store 経由）
async function deletePost() {
  if (!confirm("本当にこの投稿を削除しますか？")) return;

  try {
    await useApiFetch(`/posts/${props.post.id}`, {
      method: "DELETE",
    });

    // store からも削除
    postsStore.posts = postsStore.posts.filter(
      (p) => p.id !== props.post.id
    );

    alert("投稿を削除しました");
  } catch (error) {
    console.error("投稿の削除に失敗しました", error);
    alert("投稿の削除に失敗しました。");
  }
}
</script>

<template>
  <div class="border-b border-slate-700 p-4 flex space-x-4">
    <img
      src="/images/profile.png"
      alt="user icon"
      class="w-12 h-12 rounded-full"
    />

    <div class="w-full">
      <div class="flex items-center gap-4">
        <span class="font-bold">{{ post.user?.name }}</span>

        <div class="flex items-center gap-3">
          <!-- いいね -->
          <button
            aria-label="いいね"
            @click="postsStore.toggleLike(post.id)"
            class="flex items-center gap-1 transition-transform duration-200"
            :class="isLikedByCurrentUser ? 'text-pink-500' : 'text-white hover:text-pink-500 hover:scale-110'"
          >
            <img
              src="/images/heart.png"
              alt="like"
              class="w-[18px] h-[18px]"
            />
            <span
              :class="{ 'text-pink-500 font-bold': isLikedByCurrentUser }"
            >
              {{ post.likes_count || 0 }}
            </span>
          </button>

          <!-- 削除 -->
          <button
            aria-label="削除"
            v-if="userStore.user?.id === post.user_id"
            @click="deletePost"
            class="transition-transform duration-200 hover:scale-110"
          >
            <img
              src="/images/cross.png"
              alt="delete"
              class="w-[18px] h-[18px]"
            />
          </button>

          <!-- 詳細ページへのリンク -->
          <NuxtLink :to="`/post/${post.id}`" class="flex items-center space-x-1 hover:text-blue-500">
            <img src="/images/detail.png" alt="comment" class="w-5 h-5 transform -scale-x-100">
            <span :class="{ 'text-blue-500 font-bold': post.is_commented_by_current_user }">
            {{ post.comments_count }}
            </span>
          </NuxtLink>
        </div>
      </div>

      <p class="mt-2 whitespace-pre-wrap">{{ post.content }}</p>
    </div>
  </div>
</template>
