<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { EpisodeSource } from '@/types'

const props = defineProps<{
  title: string
  poster?: string
  sources: EpisodeSource[]
  subtitles?: Array<{ label: string; url: string; lang: string }>
  /** resume position in seconds */
  startAt?: number
}>()

const emit = defineEmits<{
  (e: 'time', value: number): void
  (e: 'ended'): void
  (e: 'sourceChanged', source: EpisodeSource): void
}>()

type HlsCtor = typeof import('hls.js').default

const videoRef = ref<HTMLVideoElement | null>(null)
const selected = ref<EpisodeSource | null>(props.sources[0] ?? null)
const hls = ref<InstanceType<HlsCtor> | null>(null)
let HlsLib: HlsCtor | null = null
const canUseNativeHls = computed(() => {
  const v = document.createElement('video')
  return v.canPlayType('application/vnd.apple.mpegurl') !== ''
})

async function getHlsLib(): Promise<HlsCtor> {
  if (HlsLib) return HlsLib
  const mod = await import('hls.js')
  HlsLib = mod.default
  return HlsLib
}

function destroyHls() {
  if (hls.value) {
    try {
      hls.value.destroy()
    } finally {
      hls.value = null
    }
  }
}

async function loadSource(source: EpisodeSource) {
  const video = videoRef.value
  if (!video) return

  destroyHls()
  video.pause()
  video.removeAttribute('src')
  while (video.firstChild) video.removeChild(video.firstChild)

  selected.value = source
  emit('sourceChanged', source)

  // Subtitles
  if (props.subtitles?.length) {
    for (const s of props.subtitles) {
      const track = document.createElement('track')
      track.kind = 'subtitles'
      track.label = s.label
      track.srclang = s.lang
      track.src = s.url
      video.appendChild(track)
    }
  }

  // HLS
  if (source.isHls || source.url.endsWith('.m3u8')) {
    if (canUseNativeHls.value) {
      video.src = source.url
    } else {
      const Hls = await getHlsLib()
      if (Hls.isSupported()) {
        const inst = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hls.value = inst
        inst.loadSource(source.url)
        inst.attachMedia(video)
      } else {
        // fallback: try set src anyway
        video.src = source.url
      }
    }
  } else {
    video.src = source.url
  }

  video.load()
}

let timeTick: number | null = null

function startTick() {
  stopTick()
  timeTick = window.setInterval(() => {
    const v = videoRef.value
    if (!v) return
    if (!Number.isFinite(v.currentTime)) return
    emit('time', v.currentTime)
  }, 2000)
}

function stopTick() {
  if (timeTick != null) {
    window.clearInterval(timeTick)
    timeTick = null
  }
}

onMounted(() => {
  if (selected.value) void loadSource(selected.value)
  startTick()
})

onBeforeUnmount(() => {
  stopTick()
  destroyHls()
})

watch(
  () => props.sources,
  (next) => {
    if (!next?.length) return
    const keep = next.find((s) => s.url === selected.value?.url) ?? next[0]
    void loadSource(keep)
  },
)

watch(
  () => props.startAt,
  (t) => {
    const v = videoRef.value
    if (!v || !t || t <= 1) return
    // only seek when metadata is ready
    const handler = () => {
      if (t < v.duration - 2) v.currentTime = t
      v.removeEventListener('loadedmetadata', handler)
    }
    v.addEventListener('loadedmetadata', handler)
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-3">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="min-w-0">
        <div class="truncate text-sm font-semibold text-zinc-50">{{ title }}</div>
        <div class="text-xs text-zinc-400">
          Источник:
          <span class="text-zinc-200">{{ selected?.label ?? '—' }}</span>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="s in sources"
          :key="s.label + s.url"
          type="button"
          class="rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-900/40"
          :class="selected?.url === s.url ? 'border-indigo-500/70 bg-indigo-500/10' : ''"
          @click="() => void loadSource(s)"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-zinc-800/60 bg-black shadow-soft">
      <video
        ref="videoRef"
        class="h-auto w-full"
        controls
        playsinline
        :poster="poster"
        @ended="$emit('ended')"
      />
    </div>

    <div class="text-xs text-zinc-500">
      Подсказка: замените `src/data/catalog.ts` на свой каталог и ссылки на HLS/MP4.
    </div>
  </div>
</template>

