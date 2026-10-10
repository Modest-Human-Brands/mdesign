import { useStorage } from '@vueuse/core'

import type { RecentDecor } from '@/domain/decor'

const MAX_RECENT = 3

export const recentDecor = useStorage<RecentDecor[]>('mdesign.decor.recent', [], undefined, {
  listenToStorageChanges: false,
})

export function rememberDecor(upload: RecentDecor): void {
  recentDecor.value = [upload, ...recentDecor.value.filter((item) => item.id !== upload.id)].slice(
    0,
    MAX_RECENT,
  )
}