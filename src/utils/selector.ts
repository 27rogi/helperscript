export const $ = <T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): T | null => {
  return parent.querySelector<T>(selector);
};

export const $all = <T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> => {
  return parent.querySelectorAll<T>(selector);
};