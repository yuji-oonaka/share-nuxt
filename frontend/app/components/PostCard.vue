<script setup lang="ts">
import { computed } from "vue";
import type { Post } from "~/app/types";
import { useToast } from "vue-toastification";

const props = defineProps<{ post: Post }>();

const userStore = useUserStore();
const postsStore = usePostsStore();
const toast = useToast();

// 🔹 ログイン中のユーザーがいいね済みかどうか
const isLikedByCurrentUser = computed(() => {
  if (!userStore.user) return false;
  return props.post.likes?.some(like => like.user_id === userStore.user!.id);
});

// 🔹 ログイン中のユーザーがコメントしているかどうか
const isCommentedByCurrentUser = computed(() => {
  if (!userStore.user) return false;
  // comments があれば判定
  if (props.post.comments?.length) {
    return props.post.comments.some(comment => comment.user_id === userStore.user.id);
  }
  // comments がなければ、store 側に is_commented_by_current_user フラグを作るなどして対応
  return props.post.is_commented_by_current_user ?? false;
});

// 🔹 投稿削除
async function deletePost() {
  if (confirm("本当にこの投稿を削除しますか？")) {
    try {
      await useApiFetch(`/posts/${props.post.id}`, { method: "DELETE" });
      postsStore.posts = postsStore.posts.filter(p => p.id !== props.post.id);
      toast.success("投稿を削除しました");
      navigateTo("/");
    } catch (error) {
      console.error("投稿の削除に失敗しました", error);
      toast.error("投稿の削除に失敗しました。");
    }
  }
}

// 🔹 いいね切り替えは store メソッドのみで操作
const handleToggleLike = async () => {
  await postsStore.toggleLike(props.post.id);
};
</script>

<template>
  <div class="border-b border-slate-700 p-4 flex space-x-4">
    <img src="/images/profile.png" alt="user icon" class="w-12 h-12 rounded-full" />
    <div class="w-full">
      <div class="flex items-center gap-4">
        <span class="font-bold">{{ post.user?.name }}</span>
        <div class="flex items-center gap-3">
          <!-- いいね -->
          <button
            aria-label="いいね"
            @click="handleToggleLike"
            class="flex items-center gap-1 transition-transform duration-200"
            :class="isLikedByCurrentUser ? 'text-pink-500' : 'text-white hover:text-pink-500 hover:scale-110'"
          >
            <img src="/images/heart.png" alt="like" class="w-[18px] h-[18px]" />
            <span :class="{ 'text-pink-500 font-bold': isLikedByCurrentUser }">
              {{ post.likes_count ?? post.likes?.length ?? 0 }}
            </span>
          </button>

          <!-- 削除 -->
          <button v-if="userStore.user?.id === post.user_id" @click="deletePost" data-testid="delete-button" class="transition-transform duration-200 hover:scale-110">
            <img src="/images/cross.png" alt="delete" class="w-[18px] h-[18px]" />
          </button>

          <!-- 詳細ページへのリンク -->
          <NuxtLink :to="`/posts/${post.id}`" class="flex items-center space-x-1 hover:text-blue-500">
            <img src="/images/detail.png" alt="comment" class="w-5 h-5 transform -scale-x-100" />
            <span :class="{ 'text-blue-500 font-bold': isCommentedByCurrentUser }">
              {{ post.comments_count ?? post.comments?.length ?? 0 }}
            </span>
          </NuxtLink>
        </div>
      </div>
      <p class="mt-2 whitespace-pre-wrap">{{ post.content }}</p>
    </div>
  </div>
</template>
