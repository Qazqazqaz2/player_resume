<template>
  <div class="rounded-3xl border border-zinc-800/60 bg-zinc-950/30 p-8">
    <div class="text-2xl font-black text-zinc-50">404</div>
    <div class="mt-2 text-sm text-zinc-400">Страница не найдена.</div>
    <div class="mt-5 flex flex-wrap gap-2">
      <RouterLink to="/" class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
        На главную
      </RouterLink>
      <RouterLink
        to="/catalog"
        class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200"
      >
        Каталог
      </RouterLink>
    </div>
  </div>
</template>

