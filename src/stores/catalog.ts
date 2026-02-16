import { defineStore } from 'pinia'
import type { Series } from '@/types'
import { localCatalog } from '@/data/catalog'

type CatalogJson = Series[] | { items: Series[] }

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function parseCatalogJson(json: unknown): Series[] {
  const items = Array.isArray(json) ? json : isRecord(json) && Array.isArray(json.items) ? json.items : null
  if (!items) throw new Error('Invalid catalog JSON: expected Series[] or { items: Series[] }')
  return items as Series[]
}

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    items: [] as Series[],
    loading: false,
    error: '' as string,
    source: '' as string,
  }),
  getters: {
    byId: (s) => (id: string) => s.items.find((x) => x.id === id),
  },
  actions: {
    async load() {
      if (this.loading) return
      if (this.items.length) return
      this.loading = true
      this.error = ''
      try {
        const url = (import.meta.env.VITE_CATALOG_URL as string | undefined)?.trim()
        if (!url) {
          this.items = localCatalog
          this.source = 'local'
          return
        }

        const res = await fetch(url, { headers: { Accept: 'application/json' } })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = (await res.json()) as CatalogJson
        this.items = parseCatalogJson(json)
        this.source = url
      } catch (e) {
        this.items = localCatalog
        this.source = 'local'
        this.error =
          e instanceof Error
            ? `Не удалось загрузить каталог по VITE_CATALOG_URL, использую демо. Причина: ${e.message}`
            : 'Не удалось загрузить каталог по VITE_CATALOG_URL, использую демо.'
      } finally {
        this.loading = false
      }
    },
  },
})

