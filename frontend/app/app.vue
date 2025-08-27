<script setup lang="ts">
// useHeadを呼び出して、サイトの<head>情報を設定
useHead({
  title: 'SHARE', // これがデフォルトのタブ名になります
  
  // (オプション) 各ページでタイトルを拡張するためのテンプレート
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - SHARE` : 'SHARE';
  }
})
</script>

<template>
    <div>
        <ClientOnly>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </ClientOnly>
    </div>
</template>