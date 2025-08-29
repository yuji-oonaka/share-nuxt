<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toastification';
// VeeValidateがフォームの状態を管理するため、refは不要
const toast = useToast();

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
        toast.success('ログアウトしました');
        router.push('/login');
    } catch (error) {
        console.error('ログアウトに失敗しました', error);
        toast.error('ログアウトに失敗しました');
    }
};

// 投稿処理 (VeeValidateから値を受け取る形)
const handlePostSubmit = async (values: { content: string }, { resetForm }: any) => {
    // values.content に入力内容が入っています
    await postsStore.createPost(values.content);
    
    // VeeValidateの関数でフォームをリセットします
    resetForm();
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

        <Form @submit="handlePostSubmit" class="space-y-4">
            <Field name="content" rules="required|max:120" v-slot="{ field, errors }">
                <textarea 
                    v-bind="field" 
                    placeholder="いまどうしてる？"
                    class="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                    :class="{ 'border-red-500': errors.length > 0 }"
                ></textarea>
            </Field>
            <ErrorMessage name="content" class="text-red-500 text-sm mt-1" />

            <div class="mt-3 flex justify-end">
                <button type="submit"
                    class="bg-[#7B61FF] text-white font-bold py-2 px-5 rounded-full hover:opacity-90 transition-opacity">
                    シェアする
                </button>
            </div>
        </Form>
    </div>
</template>