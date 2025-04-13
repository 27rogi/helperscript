import '@fontsource-variable/inter'
import 'virtual:uno.css'

import { createApp } from 'vue';
import App from './App.vue';
import Badges from './Badges.vue';
import { logger } from './utils/logger';
import { hasParams } from './utils/funcs';

const id = (import.meta.env.VITE_PROJECT_NAME as string).toLowerCase()

// @unocss-include
if (!window.frameElement) {

  const url = new URL(window.location.href);

  if (url.searchParams.has('cid[]')) {
    logger.info(`Выполняется просмотр данных из матча #${url.searchParams.get('cid[]')}`);
    if (url.searchParams.has('mode')) {
      logger.info(`Текущий режим: ${url.searchParams.get('mode')}`);
      if (url.searchParams.has('action')) {
        logger.info(`Текущее действие: ${url.searchParams.get('action')}`);
      }
    }
  }

  if (document.body.querySelector("div#rt-maintop div.rt-grid-4.rt-alpha div.ribbon1 div.rt-block div.module-content div.module-title")) {
    if ((<HTMLElement>document.body.querySelector("div#rt-maintop div.rt-grid-4.rt-alpha div.ribbon1 div.rt-block div.module-content div.module-title"))!.innerText === "Календарь") {
      if ((<HTMLElement>document.body.querySelector("th.title:nth-child(10)")).innerText === "Отчет") {
        logger.info("Выполняется просмотр отчета, показываем статы");
        document.querySelectorAll(".rt-joomla-table")[1].querySelectorAll("tr[class]").forEach((item) => {
          const badgeContainer = item.querySelector("td:nth-child(10)");
          const cid = (<HTMLInputElement>item.querySelector("td:nth-child(2) input")).value;

          if (sessionStorage.getItem("scrollTo")) {
            const id = sessionStorage.getItem("scrollTo")
            const items = document.querySelectorAll("#rt-mainbody > div > div.weblinks > form td > input.inputbox")
            console.log('lemme scroll')
            if (items) {
              console.log('lemme scroll!')
              items.forEach((checkbox) => {
                if ((<HTMLInputElement>checkbox).value == id) {
                  window.scrollTo({
                    top: checkbox.getBoundingClientRect().top + window.pageYOffset + 100,
                    behavior: 'smooth'
                  })
                }
              })
            }
            sessionStorage.removeItem("scrollTo")
          }

          createApp(Badges, { cid }).mount(
            (() => {
              const app = document.createElement('div')
              app.id = id + '-ui-badges'
              badgeContainer!.insertAdjacentElement('afterbegin', app)
              return app;
            })(),
          );
        })
      }

      if (document.querySelectorAll(".rt-grid-12.rt-alpha.rt-omega .calindarRow").length !== 0) {
        document.body.querySelectorAll(".inputbox.calindarInput#referee_id").forEach((inputBox, i) => {
          const btn = document.createElement("a")
          btn.href = "javascript:void(0)"
          btn.classList.value = "text-white p-1 leading-none font-extrabold bg-blue-700 text-base rounded-md"
          btn.innerText = "⬇"
          btn.addEventListener('click', () => {
            const nextInputBox = <HTMLSelectElement>document.body.querySelectorAll(".inputbox.calindarInput#referee_id")[i + 1]
            if (nextInputBox) {
              (<HTMLSelectElement>nextInputBox).value = (<HTMLSelectElement>inputBox).value
            }
          })
          inputBox.parentElement!.classList.value = "flex flex-row gap-2 items-center"
          inputBox.parentElement!.appendChild(btn)
        })
      }

      if (document.querySelectorAll(".rt-joomla-table").length == 2 && document.querySelector(".toolbar #toolbar-edit [title='Изменить']")) {
        if ((<HTMLElement>document.querySelector("#rt-mainbody > div > div.weblinks > form tbody tr:nth-child(1) > th:nth-child(10)")).innerText === "Отчет") {
          console.log((<HTMLElement>document.querySelector("#rt-breadcrumbs > div.rt-breadcrumb-surround > span > span:nth-child(7)")).innerText[0])
          document.querySelector(".toolbar #toolbar-edit [title='Изменить']")?.addEventListener('click', () => {
            const checkboxContainer = (<HTMLElement>document.querySelector("#rt-mainbody > div > div.weblinks > form table:nth-child(3) tbody")?.querySelector(".rokchecks-active")).parentElement
            const teamSize = Number((<HTMLElement>document.querySelector("#rt-breadcrumbs > div.rt-breadcrumb-surround > span > span:nth-child(7)")).innerText[0])
            sessionStorage.setItem(`teamsize_tour_${checkboxContainer!.querySelector('input')!.value}`, teamSize.toString());
          })
        }
      }
    }
  }

  if (hasParams(url, 'protocols', 'edit')) {
    const saveBtn = <HTMLAnchorElement>document.querySelector(".toolbar #toolbar-save a")!
    const id = url.searchParams.get('cid[]');
    saveBtn.addEventListener('click', () => {
      if (id) sessionStorage.setItem("scrollTo", id)
    })
  }

  createApp(App).mount(
    (() => {
      const app = document.createElement('div')
      app.id = id + '-ui'
      document.body.querySelector("#rt-main-surround")!.insertAdjacentElement('afterbegin', app)
      return app;
    })(),
  );
}

