<template>
    <div class="bg-slate-900 text-white h-screen flex flex-col">
        <header class="p-4 sm:p-6">
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <NuxtLink to="/">
                    <img src="/images/logo.png" alt="SHARE" class="h-8">
                </NuxtLink>
                <nav class="space-x-4">
                    <NuxtLink to="/register" class="hover:text-purple-300">新規登録</NuxtLink>
                    <NuxtLink to="/login" class="hover:text-purple-300">ログイン</NuxtLink>
                </nav>
            </div>
        </header>

        <main class="flex-grow flex items-start justify-center px-4 pt-20">
            <slot />
        </main>
    </div>
</template>