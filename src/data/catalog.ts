import type { Series } from '@/types'

/**
 * Demo catalog. Replace sources with your own licensed URLs.
 * For HLS you can use .m3u8 playlists; for MP4 just point to a file.
 */
export const localCatalog: Series[] = [
  {
    id: 'skyline-ramen',
    title: 'Лапша под небоскрёбами',
    altTitle: 'Skyline Ramen',
    year: 2025,
    status: 'Завершено',
    rating: 7.9,
    genres: ['Комедия', 'Повседневность', 'Романтика'],
    description:
      'Ещё один демо-тайтл, чтобы показать каталог/поиск/карточки. Замените постеры и серии под ваш контент.',
    poster:
      'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=900&q=70',
    banner:
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=70',
    episodes: [
      {
        id: 's1e1',
        number: 1,
        title: 'Встреча',
        durationSec: 23 * 60,
        sources: [
          {
            label: 'MP4 (demo)',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            mime: 'video/mp4',
          },
        ],
      },
    ],
  },
  {
    id: 'digital-dreams',
    title: 'Цифровые сны',
    altTitle: 'Digital Dreams',
    year: 2024,
    status: 'Онгоинг',
    rating: 9.1,
    genres: ['Фантастика', 'Драма', 'Киберпанк'],
    description:
      'Демо-тайтл для каталога. Здесь может быть полноценный синопсис и любая дополнительная информация.',
    poster:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=900&q=70',
    episodes: [],
  },
  {
    id: 'ghost-metro-line',
    title: 'Призрачная линия метро',
    altTitle: 'Ghost Metro Line',
    year: 2026,
    status: 'Онгоинг',
    rating: 8.8,
    genres: ['Ужасы', 'Мистика', 'Детектив'],
    description:
      'Демо-тайтл в духе хоррора. Замените описание и источники под ваш контент.',
    poster:
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=900&q=70',
    episodes: [],
  },
  {
    id: 'coffee-and-orbits',
    title: 'Кофе и орбиты',
    altTitle: 'Coffee and Orbits',
    year: 2022,
    status: 'Завершено',
    rating: 7.6,
    genres: ['Комедия', 'Фантастика', 'Слайс оф лайф'],
    description:
      'Лёгкий демо-тайтл про повседневность и космос. Можно использовать как шаблон для слайс-оф-лайф сериалов.',
    poster:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=900&q=70',
    episodes: [],
  },
]

export function findSeries(id: string) {
  return localCatalog.find((s) => s.id === id)
}

