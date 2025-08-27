<script setup lang="ts">
import type { Comment } from "~/app/types";

const props = defineProps<{
  comment: Comment;
  postId: number;
}>();

const userStore = useUserStore();
const postsStore = usePostsStore();
</script>

<template>
  <div class="p-4 text-white flex justify-between items-start border-b border-gray-700">
    <div>
      <p class="font-bold">{{ comment.user.name }}</p>
      <p class="mt-1 whitespace-pre-wrap">{{ comment.content }}</p>
    </div>
  </div>
</template>
