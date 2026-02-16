<script setup lang="ts">
import type { Episode } from '@/types'

defineProps<{
  seriesId: string
  episodes: Episode[]
  activeEpisodeId?: string
}>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-zinc-100">Серии</div>
      <div class="text-xs text-zinc-400">{{ episodes.length }} шт.</div>
    </div>

    <div class="max-h-[60vh] overflow-auto rounded-2xl border border-zinc-800/60 bg-zinc-950/30">
      <ul class="divide-y divide-zinc-800/60">
        <li v-for="ep in episodes" :key="ep.id">
          <RouterLink
            :to="{ name: 'watch', params: { id: seriesId, episodeId: ep.id } }"
            class="flex items-center gap-3 px-3 py-3 transition hover:bg-zinc-900/40"
            :class="activeEpisodeId === ep.id ? 'bg-indigo-500/10' : ''"
          >
            <div
              class="grid size-9 shrink-0 place-items-center rounded-xl border border-zinc-800/70 bg-zinc-950/40 text-sm font-semibold text-zinc-100"
            >
              {{ ep.number }}
            </div>
            <div class="min-w-0">
              <div class="truncate text-sm font-medium text-zinc-100">{{ ep.title }}</div>
              <div class="mt-0.5 text-xs text-zinc-400">
                <span v-if="ep.durationSec">{{ Math.round(ep.durationSec / 60) }} мин</span>
                <span v-if="ep.sources?.length"> · {{ ep.sources.length }} источник(а)</span>
              </div>
            </div>
            <div class="ml-auto text-xs text-zinc-500">Смотреть →</div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

