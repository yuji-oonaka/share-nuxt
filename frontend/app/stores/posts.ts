import { defineStore } from "pinia";
import type { Post } from "~/app/types";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [] as Post[],
  }),
  actions: {
    // 投稿一覧を取得
    async fetchPosts() {
      try {
        const posts = await useApiFetch<Post[]>("/posts");
        if (posts) {
          this.posts = posts;
        }
      } catch (error) {
        console.error("投稿の取得に失敗しました", error);
      }
    },

    // 新規投稿を作成
    async createPost(content: string) {
      if (!content.trim()) return;

      try {
        const newPost = await useApiFetch<Post>("/posts", {
          method: "POST",
          body: { content },
        });

        if (newPost) {
          // likes, comments を必ず初期化
          newPost.likes = newPost.likes || [];
          newPost.likes_count = newPost.likes_count ?? 0;
          newPost.comments = newPost.comments || [];
          newPost.comments_count = newPost.comments_count ?? 0;

          this.posts.unshift(newPost);
        }
      } catch (error) {
        console.error("投稿に失敗しました", error);
        alert("投稿に失敗しました。");
      }
    },

    // いいね切り替え
    async toggleLike(postId: number) {
      const userStore = useUserStore();
      if (!userStore.user) {
        alert("いいねするにはログインが必要です。");
        return;
      }

      const post = this.posts.find((p) => p.id === postId);
      if (!post) return;

      try {
        // APIから最新の likes_count を取得
        const response = await useApiFetch<{ likes_count: number }>(
          `/posts/${postId}/like`,
          { method: "POST" }
        );

        if (response && typeof response.likes_count === "number") {
          post.likes_count = response.likes_count;

          const currentUserId = userStore.user.id;
          const isLiked = post.likes.some(
            (like) => like.user_id === currentUserId
          );

          if (isLiked) {
            // いいね済みなら解除
            post.likes = post.likes.filter(
              (like) => like.user_id !== currentUserId
            );
          } else {
            // 未いいねなら追加
            post.likes.push({
              id: -1, // ダミーID（サーバーから返るなら置き換える）
              user_id: currentUserId,
              post_id: postId,
            });
          }
        }
      } catch (error) {
        console.error("いいね処理に失敗しました", error);
        alert("いいねに失敗しました。");
      }
    },

    // コメント追加
    async addComment(postId: number, content: string) {
      if (!content.trim()) return;

      try {
        await useApiFetch(`/posts/${postId}/comments`, {
          method: "POST",
          body: { content },
        });

        // 最新コメントを反映するために投稿を再取得して更新
        const updatedPost = await useApiFetch<Post>(`/posts/${postId}`);
        const index = this.posts.findIndex((p) => p.id === postId);
        if (updatedPost && index !== -1) {
          this.posts[index] = updatedPost;
        }
      } catch (error) {
        console.error("コメントの投稿に失敗しました", error);
        alert("コメントの投稿に失敗しました。");
      }
    },

    // コメント削除
    async deleteComment(postId: number, commentId: number) {
      try {
        await useApiFetch(`/comments/${commentId}`, {
          method: "DELETE",
        });

        // サーバーから最新の投稿データを取得して反映
        const updatedPost = await useApiFetch<Post>(`/posts/${postId}`);
        const index = this.posts.findIndex((p) => p.id === postId);
        if (updatedPost && index !== -1) {
          this.posts[index] = updatedPost;
        }
      } catch (error) {
        console.error("コメントの削除に失敗しました", error);
        alert("コメントの削除に失敗しました。");
      }
    },
  },
});
