<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { Post } from "~/app/types";
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toastification';

useHead({ title: "コメント" });
definePageMeta({ middleware: "auth" });

const route = useRoute();
const postsStore = usePostsStore();
const userStore = useUserStore();
const toast = useToast();
const postId = Number(route.params.id);

// 🔹 store から投稿を直接参照（リアルタイム更新用）
const post = computed<Post | undefined>(() =>
  postsStore.posts.find(p => p.id === postId)
);

// 🔹 投稿詳細を取得（初回ロード）
const fetchPost = async () => {
  try {
    const fetchedPost = await useApiFetch<Post>(`/posts/${postId}`, { cache: "no-cache" });
    if (!fetchedPost) return;

    const index = postsStore.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const existing = postsStore.posts[index];
      postsStore.posts[index] = {
        ...fetchedPost,
        likes: existing.likes ?? fetchedPost.likes,
        likes_count: existing.likes_count ?? fetchedPost.likes_count,
        comments: existing.comments ?? fetchedPost.comments,
        comments_count: existing.comments_count ?? fetchedPost.comments_count,
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
const handleCommentSubmit = async (values: { comment: string }, { resetForm }: any) => {
  if (!post.value) return;
  await postsStore.addComment(post.value.id, values.comment);
  resetForm();
  await fetchPost();
};

// 🔹 投稿削除
const handleDeletePost = async () => {
  if (!post.value) return;
  if (confirm("本当にこの投稿を削除しますか？")) {
    try {
      await useApiFetch(`/posts/${post.value.id}`, { method: "DELETE" });
      toast.success("投稿を削除しました");
      navigateTo("/");
    } catch (error) {
      console.error("投稿の削除に失敗しました", error);
      toast.error("投稿の削除に失敗しました。");
    }
  }
};
</script>

<template>
  <div>
    <div v-if="post">
      <h1 class="text-xl font-bold text-white p-4 border-b border-gray-700">コメント</h1>
      <!-- store のリアルオブジェクトをそのまま渡す -->
      <PostCard :post="post" />

      <div v-for="comment in reversedComments" :key="comment.id">
        <CommentCard :comment="comment" :postId="post.id" />
      </div>

      <div class="p-4">
        <Form @submit="handleCommentSubmit">
          <Field name="comment" rules="required|max:120" v-slot="{ field, errors }">
            <input
              v-bind="field"
              placeholder="コメントを入力"
              class="w-full p-2 rounded-lg bg-slate-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              :class="{ 'border-red-500': errors.length > 0 }"
            />
          </Field>
          <ErrorMessage name="comment" class="text-red-500 text-sm mt-1" />
          <div class="flex justify-end mt-2">
            <button
              type="submit"
              class="bg-purple-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-purple-600 active:bg-purple-700 border-b-4 border-purple-700 active:border-b-0 active:translate-y-1 transform transition-all duration-150 focus:outline-none"
            >
              コメント
            </button>
          </div>
        </Form>
      </div>
    </div>

    <div v-else class="p-4 text-center">
      読み込み中...
    </div>
  </div>
</template>
