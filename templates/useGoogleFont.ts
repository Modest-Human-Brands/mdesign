import { loadGoogleFont } from '@/domain/fonts'

/** Loads a font a template needs beyond the brand font (e.g. a monospace face). Fire and forget. */
export function useGoogleFont(family: string): void {
  void loadGoogleFont(family)
}