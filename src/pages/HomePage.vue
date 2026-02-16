<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLibraryStore } from '@/stores/library'
import { useCatalogStore } from '@/stores/catalog'
import SeriesGrid from '@/components/SeriesGrid.vue'

const lib = useLibraryStore()
const cat = useCatalogStore()

onMounted(() => {
  void cat.load()
})

const featured = computed(() => cat.items[0])

const continueItems = computed(() => {
  const entries = Object.values(lib.progress)
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 6)

  return entries
    .map((p) => {
      const s = cat.items.find((x) => x.id === p.seriesId)
      if (!s) return null
      const ep = s.episodes.find((e) => e.id === p.episodeId)
      return { series: s, episode: ep, progress: p }
    })
    .filter(Boolean) as Array<{
    series: (typeof cat.items)[number]
    episode?: (typeof cat.items)[number]['episodes'][number]
    progress: { seriesId: string; episodeId: string; time: number; updatedAt: number }
  }>
})

const latest = computed(() =>
  cat.items
    .slice()
    .sort((a, b) => b.year - a.year)
    .slice(0, 8),
)
</script>

<template>
  <div class="space-y-10">
    <section
      v-if="featured"
      class="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/30"
    >
      <div class="absolute inset-0">
        <img
          :src="featured.banner ?? featured.poster"
          :alt="featured.title"
          class="h-full w-full object-cover opacity-35"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/65 to-zinc-950/15" />
      </div>

      <div class="relative grid gap-6 p-6 md:grid-cols-[1.2fr_.8fr] md:p-10">
        <div class="space-y-4">
          <div class="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
            <span class="font-semibold">Шаблон</span>
            <span class="text-indigo-300/80">каталог · тайтл · серии · плеер</span>
          </div>

          <h1 class="text-balance text-2xl font-black tracking-tight text-zinc-50 md:text-4xl">
            {{ featured.title }}
          </h1>
          <p class="max-w-xl text-pretty text-sm leading-relaxed text-zinc-300 md:text-base">
            {{ featured.description }}
          </p>

          <div class="flex flex-wrap items-center gap-2">
            <RouterLink
              :to="{ name: 'series', params: { id: featured.id } }"
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 active:bg-indigo-600"
            >
              Открыть тайтл
            </RouterLink>
            <RouterLink
              to="/catalog"
              class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900/40"
            >
              Перейти в каталог
            </RouterLink>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span>{{ featured.year }}</span>
            <span class="text-zinc-700">•</span>
            <span>{{ featured.status }}</span>
            <span class="text-zinc-700">•</span>
            <span>{{ featured.genres.join(' · ') }}</span>
          </div>
        </div>

        <div class="hidden md:block">
          <div class="grid aspect-[2/3] max-w-[320px] place-items-center overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/30 shadow-soft">
            <img :src="featured.poster" :alt="featured.title" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <section v-if="continueItems.length" class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-zinc-50">Продолжить просмотр</h2>
          <div class="text-sm text-zinc-400">Мы запоминаем позицию локально в браузере.</div>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="item in continueItems"
          :key="item.progress.seriesId + item.progress.episodeId"
          :to="{ name: 'watch', params: { id: item.series.id, episodeId: item.progress.episodeId } }"
          class="group flex items-center gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-950/30 p-3 transition hover:bg-zinc-900/30"
        >
          <img :src="item.series.poster" class="size-14 rounded-xl object-cover" :alt="item.series.title" />
          <div class="min-w-0">
            <div class="truncate text-sm font-semibold text-zinc-100">{{ item.series.title }}</div>
            <div class="mt-0.5 text-xs text-zinc-400">
              Серия: <span class="text-zinc-200">{{ item.episode?.number ?? '—' }}</span>
              · Позиция: <span class="text-zinc-200">{{ Math.round(item.progress.time) }}s</span>
            </div>
          </div>
          <div class="ml-auto text-xs text-zinc-500 group-hover:text-zinc-300">▶</div>
        </RouterLink>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-end justify-between gap-4">
        <div>
          <h2 class="text-lg font-bold text-zinc-50">Новые в каталоге</h2>
          <div class="text-sm text-zinc-400">
            <span v-if="cat.error" class="text-amber-200">{{ cat.error }}</span>
            <span v-else>
              Источник: <span class="text-zinc-200">{{ cat.source || '—' }}</span>
            </span>
          </div>
        </div>
        <RouterLink to="/catalog" class="text-sm font-semibold text-indigo-200 hover:text-indigo-100">
          Все тайтлы →
        </RouterLink>
      </div>

      <SeriesGrid :items="latest" />
    </section>
  </div>
</template>

