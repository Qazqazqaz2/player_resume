export type Genre =
  | 'Экшен'
  | 'Драма'
  | 'Комедия'
  | 'Романтика'
  | 'Фэнтези'
  | 'Сёнен'
  | 'Исекай'
  | 'Триллер'
  | 'Повседневность'
  | 'Сверхъестественное'
  | 'Фантастика'
  | 'Киберпанк'
  | 'Музыка'
  | 'Ужасы'
  | 'Детектив'
  | 'Мистика'
  | 'Слайс оф лайф'
  | 'Ретро'
  | 'Психологическое'
  | 'Сейнен'

export type EpisodeSource = {
  /** Display name, e.g. "1080p" or "HLS" */
  label: string
  /** Video url: .m3u8 or .mp4 */
  url: string
  /** Optional mime for mp4/webm */
  mime?: string
  /** HLS playlist? */
  isHls?: boolean
}

export type Episode = {
  id: string
  number: number
  title: string
  durationSec?: number
  sources: EpisodeSource[]
  poster?: string
  /** Optional subtitles (vtt) */
  subtitles?: Array<{ label: string; url: string; lang: string }>
}

export type Series = {
  id: string
  title: string
  altTitle?: string
  year: number
  status: 'Онгоинг' | 'Завершено'
  rating?: number
  genres: Genre[]
  description: string
  poster: string
  banner?: string
  episodes: Episode[]
}

