<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const q = ref<string>(typeof route.query.q === 'string' ? route.query.q : '')
const isCatalog = computed(() => route.name === 'catalog')

function submit() {
  router.push({ name: 'catalog', query: { q: q.value || undefined } })
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/80 backdrop-blur">
    <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
      <RouterLink
        to="/"
        class="group flex items-center gap-2 rounded-xl px-2 py-1 transition hover:bg-zinc-900/60"
      >
        <div
          class="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 shadow-soft"
        >
          <span class="text-sm font-black tracking-tight">AP</span>
        </div>
        <div class="leading-tight">
          <div class="text-sm font-semibold text-zinc-50">Anime Player</div>
          <div class="text-xs text-zinc-400">каталог · плеер · серии</div>
        </div>
      </RouterLink>

      <nav class="ml-2 hidden items-center gap-1 sm:flex">
        <RouterLink
          to="/catalog"
          class="rounded-xl px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-900/60"
          :class="isCatalog ? 'bg-zinc-900/70' : ''"
          >Каталог</RouterLink
        >
      </nav>

      <div class="ml-auto w-full max-w-md">
        <form @submit.prevent="submit" class="flex items-center gap-2">
          <input
            v-model="q"
            class="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-0 transition focus:border-indigo-500/70"
            placeholder="Поиск тайтла…"
            name="q"
            autocomplete="off"
          />
          <button
            type="submit"
            class="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 active:bg-indigo-600"
          >
            Найти
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

