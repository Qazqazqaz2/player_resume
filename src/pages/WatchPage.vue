<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EpisodeList from '@/components/EpisodeList.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import { useLibraryStore } from '@/stores/library'
import { useCatalogStore } from '@/stores/catalog'

const route = useRoute()
const router = useRouter()
const lib = useLibraryStore()
const cat = useCatalogStore()

const seriesId = computed(() => String(route.params.id ?? ''))
const episodeId = computed(() => String(route.params.episodeId ?? ''))
const series = computed(() => cat.byId(seriesId.value))
const episode = computed(() => series.value?.episodes.find((e) => e.id === episodeId.value))

const progressKey = computed(() => `${seriesId.value}:${episodeId.value}`)
const startAt = computed(() => lib.progress[progressKey.value]?.time ?? 0)

const episodeIndex = computed(() => {
  const eps = series.value?.episodes ?? []
  return eps.findIndex((e) => e.id === episodeId.value)
})
const prevEpisode = computed(() => {
  const eps = series.value?.episodes ?? []
  const i = episodeIndex.value
  return i > 0 ? eps[i - 1] : undefined
})
const nextEpisode = computed(() => {
  const eps = series.value?.episodes ?? []
  const i = episodeIndex.value
  return i >= 0 && i < eps.length - 1 ? eps[i + 1] : undefined
})

function goEpisode(id: string) {
  router.push({ name: 'watch', params: { id: seriesId.value, episodeId: id } })
}

function onTime(t: number) {
  if (!series.value || !episode.value) return
  lib.setProgress({ seriesId: series.value.id, episodeId: episode.value.id, time: t })
}

function onEnded() {
  if (nextEpisode.value) goEpisode(nextEpisode.value.id)
}

onMounted(() => {
  void cat.load()
})

watch(
  () => [seriesId.value, episodeId.value],
  () => {
    // ensure episode exists, otherwise fallback to first
    if (!series.value) return
    if (!episode.value && series.value.episodes[0]) {
      router.replace({ name: 'watch', params: { id: series.value.id, episodeId: series.value.episodes[0].id } })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="series && episode" class="space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="min-w-0">
        <RouterLink :to="{ name: 'series', params: { id: series.id } }" class="text-sm font-semibold text-indigo-200 hover:text-indigo-100">
          ← {{ series.title }}
        </RouterLink>
        <div class="mt-1 truncate text-lg font-bold text-zinc-50">
          Серия {{ episode.number }}: {{ episode.title }}
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-900/40 disabled:opacity-40"
          :disabled="!prevEpisode"
          @click="prevEpisode && goEpisode(prevEpisode.id)"
        >
          ← Пред.
        </button>
        <button
          type="button"
          class="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 active:bg-indigo-600 disabled:opacity-40"
          :disabled="!nextEpisode"
          @click="nextEpisode && goEpisode(nextEpisode.id)"
        >
          След. →
        </button>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section class="space-y-4">
        <VideoPlayer
          :title="`${series.title} — серия ${episode.number}`"
          :poster="episode.poster ?? series.banner ?? series.poster"
          :sources="episode.sources"
          :subtitles="episode.subtitles"
          :start-at="startAt"
          @time="onTime"
          @ended="onEnded"
        />

        <div class="rounded-2xl border border-zinc-800/60 bg-zinc-950/30 p-4 text-sm text-zinc-300">
          <div class="font-semibold text-zinc-100">Заметки</div>
          <div class="mt-2">
            Если вы подставляете HLS, убедитесь, что сервер отдаёт CORS заголовки, иначе браузер не даст
            воспроизвести поток.
          </div>
        </div>
      </section>

      <aside class="space-y-3">
        <EpisodeList :series-id="series.id" :episodes="series.episodes" :active-episode-id="episode.id" />

        <div class="rounded-2xl border border-zinc-800/60 bg-zinc-950/30 p-4">
          <div class="text-sm font-semibold text-zinc-100">Быстрые действия</div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2 text-xs font-semibold transition hover:bg-zinc-900/40"
              :class="lib.isFavorite(series.id) ? 'text-pink-200 border-pink-500/40 bg-pink-500/10' : 'text-zinc-200'"
              @click="lib.toggleFavorite(series.id)"
            >
              {{ lib.isFavorite(series.id) ? 'Убрать из избранного' : 'В избранное' }}
            </button>
            <button
              type="button"
              class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-900/40"
              @click="lib.clearProgress(series.id)"
            >
              Сбросить прогресс
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>

  <div v-else class="rounded-3xl border border-zinc-800/60 bg-zinc-950/30 p-6">
    <div class="text-lg font-bold text-zinc-50">Серия не найдена</div>
    <div class="mt-2 text-sm text-zinc-400">Проверьте ссылку или откройте тайтл заново.</div>
    <div class="mt-4 flex flex-wrap gap-2">
      <RouterLink to="/catalog" class="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white">
        В каталог
      </RouterLink>
      <RouterLink to="/" class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-2 text-sm font-semibold text-zinc-200">
        На главную
      </RouterLink>
    </div>
  </div>
</template>

