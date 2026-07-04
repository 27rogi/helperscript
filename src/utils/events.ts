import { $ } from "@/utils/selector";

export const onProtocolSave = (callback: () => void) => {
  $("tr #toolbar-save a", document.body)?.addEventListener("click", () => {
    callback();
  })
}