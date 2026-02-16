import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  // BASE_URL подставляется Vite из vite.config.ts (base: '/player_resume/')
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    { path: '/catalog', name: 'catalog', component: () => import('@/pages/CatalogPage.vue') },
    { path: '/title/:id', name: 'series', component: () => import('@/pages/SeriesPage.vue') },
    {
      path: '/watch/:id/:episodeId',
      name: 'watch',
      component: () => import('@/pages/WatchPage.vue'),
    },
    { path: '/:pathMatch(.*)*', name: '404', component: () => import('@/pages/NotFound.vue') },
  ],
})

