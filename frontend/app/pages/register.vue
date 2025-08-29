<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useToast } from 'vue-toastification';

const { signUp } = useAuth();
const router = useRouter();
const config = useRuntimeConfig();
const toast = useToast();
const userStore = useUserStore(); // 👈 この行を追加

useHead({
  title: '登録',
});

definePageMeta({
    layout: 'auth',
    middleware: 'auth'
});

const handleRegister = async (values: any) => {
    try {
        // 1. Firebase Authへの登録
        const userCredential = await signUp(values.email, values.password);

        // 2. バックエンドDBへの登録 (戻り値を受け取る)
        const newUser = await $fetch(`${config.public.apiBaseUrl}/users`, {
            method: 'POST',
            body: {
                name: values.username,
                email: values.email,
                firebase_uid: userCredential.user.uid,
            }
        });

        // 3. Piniaストアを直接更新する
        if (newUser) {
            userStore.setUser(newUser);
            userStore.setAuthReady(true); 
        }

        // 4. ストア更新後、ホーム画面へ移動する
        await router.push('/');
        
        toast.success('登録が完了し、ログインしました');

    } catch (error: any) {
        console.error('Registration failed:', error);
        toast.error('登録に失敗しました。既に使用されているメールアドレスの可能性があります。');
    }
};
</script>

<template>
    <div class="bg-white text-black rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">新規登録</h2>
        <Form @submit="handleRegister">

            <div class="mb-4">
                <label for="username" class="block mb-2 text-sm font-medium">ユーザーネーム</label>
                <Field name="username" rules="required|max:20" v-slot="{ field, errors }">
                    <input v-bind="field" type="text" id="username"
                        class="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        :class="{ 'border-red-500': errors.length > 0 }" />
                </Field>
                <ErrorMessage name="username" class="text-red-500 text-sm mt-1" />
            </div>

            <div class="mb-4">
                <label for="email" class="block mb-2 text-sm font-medium">メールアドレス</label>
                <Field name="email" rules="required|email" v-slot="{ field, errors }">
                    <input v-bind="field" type="email" id="email"
                        class="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        :class="{ 'border-red-500': errors.length > 0 }" />
                </Field>
                <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
            </div>

            <div class="mb-6">
                <label for="password" class="block mb-2 text-sm font-medium">パスワード</label>
                <Field name="password" rules="required|min:6" v-slot="{ field, errors }">
                    <input v-bind="field" type="password" id="password"
                        class="w-full p-3 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        :class="{ 'border-red-500': errors.length > 0 }" />
                </Field>
                <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
            </div>

            <button type="submit"
                class="w-full bg-purple-600 text-white rounded-lg py-3 font-bold hover:bg-purple-700 transition-colors">
                新規登録
            </button>
        </Form>
    </div>
</template>