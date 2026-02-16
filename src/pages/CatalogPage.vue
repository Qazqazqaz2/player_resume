<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SeriesGrid from '@/components/SeriesGrid.vue'
import type { Genre } from '@/types'
import { useCatalogStore } from '@/stores/catalog'

const route = useRoute()
const router = useRouter()
const cat = useCatalogStore()

onMounted(() => {
  void cat.load()
})

const q = ref<string>(typeof route.query.q === 'string' ? route.query.q : '')
const genre = ref<string>(typeof route.query.genre === 'string' ? route.query.genre : '')
const status = ref<string>(typeof route.query.status === 'string' ? route.query.status : '')

watch(
  () => route.query,
  (query) => {
    q.value = typeof query.q === 'string' ? query.q : ''
    genre.value = typeof query.genre === 'string' ? query.genre : ''
    status.value = typeof query.status === 'string' ? query.status : ''
  },
)

const genres = computed(() => {
  const set = new Set<string>()
  for (const s of cat.items) for (const g of s.genres) set.add(g)
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'ru'))
})

const filtered = computed(() => {
  const qq = q.value.trim().toLowerCase()
  return cat.items
    .filter((s) => {
      if (status.value && s.status !== status.value) return false
      if (genre.value && !s.genres.includes(genre.value as Genre)) return false
      if (!qq) return true
      return (
        s.title.toLowerCase().includes(qq) ||
        (s.altTitle?.toLowerCase().includes(qq) ?? false) ||
        s.description.toLowerCase().includes(qq)
      )
    })
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
})

function syncQuery() {
  router.replace({
    name: 'catalog',
    query: {
      q: q.value || undefined,
      genre: genre.value || undefined,
      status: status.value || undefined,
    },
  })
}

function resetFilters() {
  q.value = ''
  genre.value = ''
  status.value = ''
  syncQuery()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-xl font-bold text-zinc-50">Каталог</h1>
        <div class="text-sm text-zinc-400">
          Поиск и фильтры в URL (можно делиться ссылкой).
          <span v-if="cat.error" class="block text-amber-200">{{ cat.error }}</span>
        </div>
      </div>
      <div class="text-sm text-zinc-400">
        Найдено: <span class="font-semibold text-zinc-200">{{ filtered.length }}</span>
      </div>
    </div>

    <div class="grid gap-3 rounded-3xl border border-zinc-800/60 bg-zinc-950/30 p-4 md:grid-cols-3">
      <label class="space-y-1">
        <div class="text-xs font-semibold text-zinc-300">Поиск</div>
        <input
          v-model="q"
          class="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-indigo-500/70"
          placeholder="Название / описание…"
          @input="syncQuery"
        />
      </label>

      <label class="space-y-1">
        <div class="text-xs font-semibold text-zinc-300">Жанр</div>
        <select
          v-model="genre"
          class="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-indigo-500/70"
          @change="syncQuery"
        >
          <option value="">Любой</option>
          <option v-for="g in genres" :key="g" :value="g">{{ g }}</option>
        </select>
      </label>

      <label class="space-y-1">
        <div class="text-xs font-semibold text-zinc-300">Статус</div>
        <select
          v-model="status"
          class="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/70 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-indigo-500/70"
          @change="syncQuery"
        >
          <option value="">Любой</option>
          <option value="Онгоинг">Онгоинг</option>
          <option value="Завершено">Завершено</option>
        </select>
      </label>

      <div class="md:col-span-3 flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-900/40"
          @click="resetFilters"
        >
          Сбросить
        </button>
      </div>
    </div>

    <SeriesGrid :items="filtered" />
  </div>
</template>

