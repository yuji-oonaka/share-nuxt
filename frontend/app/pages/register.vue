<script setup lang="ts">
import { Form, Field, ErrorMessage } from 'vee-validate';
import { ref } from 'vue';
const { signUp } = useAuth();
const router = useRouter();
const config = useRuntimeConfig();
const errorMessage = ref('');

useHead({
  title: '登録', // このページのタイトルを「ホーム」に設定
});

definePageMeta({
    layout: 'auth',
    middleware: 'auth'
});

// handleRegisterがフォームの値(values)を受け取るように変更
const handleRegister = async (values: any) => {
    try {
        const userCredential = await signUp(values.email, values.password);

        await $fetch(`${config.public.apiBaseUrl}/users`, {
            method: 'POST',
            body: {
                name: values.username,
                email: values.email,
                firebase_uid: userCredential.user.uid,
            }
        });

        alert('登録が完了しました。ログインしてください。');
        router.push('/login');

    } catch (error: any) {
        console.error('Registration failed:', error);
        errorMessage.value = '登録に失敗しました。入力内容を確認するか、既に使用されているメールアドレスです。';
    }
};
</script>

<template>
    <div class="bg-white text-black rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">新規登録</h2>
        <Form @submit="handleRegister">
            <p v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</p>

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
                <Field name="password" rules="required" v-slot="{ field, errors }">
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