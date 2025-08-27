<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';

useHead({
  title: 'ログイン', // このページのタイトルを「ホーム」に設定
});

definePageMeta({
    layout: 'auth',
    middleware: 'auth'
});

const { logIn } = useAuth();
const userStore = useUserStore();
const router = useRouter();
const errorMessage = ref('');

// handleLoginがフォームの値(values)を受け取るように変更
const handleLogin = async (values: any) => {
    try {
        await logIn(values.email, values.password);
        await userStore.fetchUser();
        router.push('/');
    } catch (error: any) {
        console.error('Login failed:', error);
        errorMessage.value = 'メールアドレスまたはパスワードが違います。';
    }
};
</script>

<template>
    <div class="bg-white text-black rounded-lg shadow-xl p-8 w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">ログイン</h2>
        <Form @submit="handleLogin">
            <p v-if="errorMessage" class="text-red-500 text-center mb-4">{{ errorMessage }}</p>

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
                ログイン
            </button>
        </Form>
    </div>
</template>