import { defineStore } from 'pinia'
import { readJson, writeJson } from '@/utils/storage'

type ProgressMap = Record<
  string,
  {
    seriesId: string
    episodeId: string
    /** seconds */
    time: number
    updatedAt: number
  }
>

type Favorites = string[]

const KEY_FAV = 'anime_player:favorites:v1'
const KEY_PROGRESS = 'anime_player:progress:v1'

export const useLibraryStore = defineStore('library', {
  state: () => ({
    favorites: readJson<Favorites>(KEY_FAV, []),
    progress: readJson<ProgressMap>(KEY_PROGRESS, {}),
  }),
  getters: {
    isFavorite: (s) => (seriesId: string) => s.favorites.includes(seriesId),
    lastWatchedEpisode: (s) => (seriesId: string) => {
      const entries = Object.values(s.progress).filter((p) => p.seriesId === seriesId)
      entries.sort((a, b) => b.updatedAt - a.updatedAt)
      return entries[0]
    },
  },
  actions: {
    toggleFavorite(seriesId: string) {
      const set = new Set(this.favorites)
      if (set.has(seriesId)) set.delete(seriesId)
      else set.add(seriesId)
      this.favorites = Array.from(set)
      writeJson(KEY_FAV, this.favorites)
    },
    setProgress(params: { seriesId: string; episodeId: string; time: number }) {
      const key = `${params.seriesId}:${params.episodeId}`
      this.progress[key] = {
        seriesId: params.seriesId,
        episodeId: params.episodeId,
        time: Math.max(0, Math.floor(params.time)),
        updatedAt: Date.now(),
      }
      writeJson(KEY_PROGRESS, this.progress)
    },
    clearProgress(seriesId: string) {
      for (const key of Object.keys(this.progress)) {
        if (key.startsWith(`${seriesId}:`)) delete this.progress[key]
      }
      writeJson(KEY_PROGRESS, this.progress)
    },
  },
})

