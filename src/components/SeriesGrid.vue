<script setup lang="ts">
import type { Series } from '@/types'
import SeriesCard from '@/components/SeriesCard.vue'

defineProps<{
  items: Series[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    <SeriesCard v-for="s in items" :key="s.id" :series="s" />
  </div>
</template>

