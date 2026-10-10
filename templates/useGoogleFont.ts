import { loadGoogleFont } from '@/domain/fonts'

export function useGoogleFont(family: string): void {
  void loadGoogleFont(family)
}