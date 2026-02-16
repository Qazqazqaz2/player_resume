<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EpisodeList from '@/components/EpisodeList.vue'
import { useLibraryStore } from '@/stores/library'
import { useCatalogStore } from '@/stores/catalog'

const route = useRoute()
const router = useRouter()
const lib = useLibraryStore()
const cat = useCatalogStore()

const id = computed(() => String(route.params.id ?? ''))
const series = computed(() => cat.byId(id.value))

const continueInfo = computed(() => (series.value ? lib.lastWatchedEpisode(series.value.id) : undefined))

onMounted(() => {
  void cat.load()
})

function watchFromStart() {
  const s = series.value
  if (!s?.episodes.length) return
  router.push({ name: 'watch', params: { id: s.id, episodeId: s.episodes[0].id } })
}

function watchContinue() {
  const s = series.value
  const last = continueInfo.value
  if (!s || !last) return
  router.push({ name: 'watch', params: { id: s.id, episodeId: last.episodeId } })
}
</script>

<template>
  <div v-if="series" class="space-y-6">
    <section class="relative overflow-hidden rounded-3xl border border-zinc-800/60 bg-zinc-950/30">
      <div class="absolute inset-0">
        <img :src="series.banner ?? series.poster" :alt="series.title" class="h-full w-full object-cover opacity-35" />
        <div class="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-zinc-950/10" />
      </div>

      <div class="relative grid gap-6 p-5 md:grid-cols-[220px_1fr] md:p-8">
        <div class="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/40 shadow-soft">
          <img :src="series.poster" :alt="series.title" class="h-full w-full object-cover" />
        </div>

        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="rounded-full border border-zinc-700/70 bg-zinc-950/70 px-2 py-1 text-xs text-zinc-200">
              {{ series.status }}
            </span>
            <span v-if="series.rating" class="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-200">
              ★ {{ series.rating.toFixed(1) }}
            </span>
            <span class="text-xs text-zinc-400">{{ series.year }}</span>
          </div>

          <h1 class="text-balance text-2xl font-black tracking-tight text-zinc-50 md:text-3xl">
            {{ series.title }}
          </h1>
          <div v-if="series.altTitle" class="text-sm text-zinc-400">{{ series.altTitle }}</div>

          <div class="flex flex-wrap gap-2 pt-1">
            <span
              v-for="g in series.genres"
              :key="g"
              class="rounded-full border border-zinc-800/70 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300"
            >
              {{ g }}
            </span>
          </div>

          <p class="text-sm leading-relaxed text-zinc-300 md:text-base">
            {{ series.description }}
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 active:bg-indigo-600"
              @click="watchFromStart"
            >
              Смотреть
            </button>

            <button
              v-if="continueInfo"
              type="button"
              class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900/40"
              @click="watchContinue"
            >
              Продолжить
            </button>

            <button
              type="button"
              class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-2 text-sm font-semibold transition hover:bg-zinc-900/40"
              :class="lib.isFavorite(series.id) ? 'text-pink-200 border-pink-500/40 bg-pink-500/10' : 'text-zinc-200'"
              @click="lib.toggleFavorite(series.id)"
            >
              {{ lib.isFavorite(series.id) ? 'В избранном' : 'В избранное' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section class="space-y-3">
        <div class="rounded-3xl border border-zinc-800/60 bg-zinc-950/30 p-4">
          <div class="text-sm font-semibold text-zinc-100">О тайтле</div>
          <div class="mt-2 text-sm text-zinc-300">
            Здесь можно расширить блок: студия, режиссёр, озвучка, тайминги, скриншоты, трейлеры, комментарии.
          </div>
          <div class="mt-3 text-xs text-zinc-500">
            <span v-if="cat.error" class="text-amber-200">{{ cat.error }}</span>
            <span v-else>Источник каталога: <span class="text-zinc-200">{{ cat.source || '—' }}</span></span>
          </div>
        </div>
      </section>

      <aside>
        <EpisodeList :series-id="series.id" :episodes="series.episodes" />
      </aside>
    </div>
  </div>

  <div v-else class="rounded-3xl border border-zinc-800/60 bg-zinc-950/30 p-6">
    <div class="text-lg font-bold text-zinc-50">Тайтл не найден</div>
    <div class="mt-2 text-sm text-zinc-400">Проверьте ссылку или откройте каталог.</div>
    <RouterLink to="/catalog" class="mt-4 inline-flex rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
      В каталог
    </RouterLink>
  </div>
</template>

