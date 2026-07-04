import { $ } from '@/utils/selector'

export function hasParams(url: URL, mode: string | null, action: string | null): boolean {
  if (url.searchParams == null)
    return false
  if (!url.searchParams.has('tournament_id'))
    return false
  if (mode) {
    if (!url.searchParams.has('mode') || url.searchParams.get('mode') !== mode)
      return false
  }
  if (action) {
    if (!url.searchParams.has('action') || url.searchParams.get('action') !== action)
      return false
  }
  if ($('#rt-maintop', document.body) == null)
    return false
  return true
}
