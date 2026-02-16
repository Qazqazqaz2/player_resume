<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <div class="min-h-dvh">
    <AppHeader />
    <main class="mx-auto w-full max-w-6xl px-4 pb-14 pt-6">
      <RouterView />
    </main>
    <footer class="border-t border-zinc-800/70 bg-zinc-950/60">
      <div class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-zinc-400">
        <div class="text-zinc-300">Anime Player (шаблон на Vue)</div>
        <div>
          Используйте только свой/лицензионный контент. Этот проект не содержит логики парсинга пиратских
          источников.
        </div>
      </div>
    </footer>
  </div>
</template>

