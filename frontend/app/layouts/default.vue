<template>
  <div class="bg-slate-900 text-white min-h-screen">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 md:gap-6">
      
      <aside class="md:col-span-3 py-6 px-4">
        <div class="sticky top-6">
          <Sidebar />
        </div>
      </aside>

      <main class="md:col-span-6 border-x border-slate-700 min-h-screen">
        <slot />
      </main>

      <aside class="hidden md:block md:col-span-3 py-6">
        </aside>

    </div>
  </div>
</template>