import { $ } from '@/utils/selector'

export function onProtocolSave(callback: () => void) {
  $('tr #toolbar-save a', document.body)?.addEventListener('click', () => {
    callback()
  })
}
