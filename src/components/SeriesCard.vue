<script setup lang="ts">
import type { Series } from '@/types'

defineProps<{
  series: Series
  compact?: boolean
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'series', params: { id: series.id } }"
    class="group relative block overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-950/40 transition hover:-translate-y-0.5 hover:border-zinc-700/70 hover:bg-zinc-900/30"
  >
    <div class="relative aspect-[2/3] w-full overflow-hidden">
      <img
        :src="series.poster"
        :alt="series.title"
        loading="lazy"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      />
      <div
        class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-zinc-950/95 to-transparent"
      />
      <div class="absolute left-3 top-3 flex items-center gap-2">
        <span
          class="rounded-full border border-zinc-700/70 bg-zinc-950/70 px-2 py-1 text-xs text-zinc-200"
          >{{ series.status }}</span
        >
        <span
          v-if="series.rating"
          class="rounded-full bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-200"
          >★ {{ series.rating.toFixed(1) }}</span
        >
      </div>
    </div>

    <div class="space-y-1 px-3 pb-3 pt-2">
      <div class="line-clamp-2 text-sm font-semibold text-zinc-50">
        {{ series.title }}
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <span>{{ series.year }}</span>
        <span class="text-zinc-700">•</span>
        <span class="line-clamp-1">{{ series.genres.slice(0, 3).join(' · ') }}</span>
      </div>
    </div>
  </RouterLink>
</template>

