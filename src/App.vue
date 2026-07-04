<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import ProtocolDetails from '#/ProtocolDetails.vue'
import ProtocolEditor from '#/ProtocolEditor.vue'
import { hasParams } from '@/utils/url'

const url = new URL(window.location.href)
const showMenu = useLocalStorage('script-menu-hidden', false)
</script>

<template>
  <div class="app -my-2">
    <div class="text-xs mb-2 px-2 flex flex-col">
      <button class="lh-btn" @click="showMenu = !showMenu">
        {{ showMenu ? "Закрыть" : "Открыть" }} скрипт
      </button>
    </div>
    <div v-if="showMenu" class="text-base font-bold px-4 pb-2 flex flex-col gap-2">
      <div class="flex flex-row gap-2 items-center">
        <h1 class="text-sm">
          Турнир #<span class="text-blue-600 font-bold">{{ url.searchParams.get("cid[]") }}</span> (Протокол #
          <span class="text-blue-600 font-bold">{{
            url.searchParams.get("tournament_id")
          }}</span>)
        </h1>
        <div class="ml-auto flex flex-row flex-wrap">
          <p v-if="url.searchParams.has('mode')" class="infoblock">
            Режим: {{ url.searchParams.get("mode") }}
          </p>
          <p v-if="url.searchParams.has('action')" class="infoblock">
            Действие: {{ url.searchParams.get("action") }}
          </p>
        </div>
      </div>
      <ProtocolEditor v-if="hasParams(url, 'protocols', 'edit')" />
      <ProtocolDetails v-if="hasParams(url, 'protocols', 'full')" />
    </div>
  </div>
</template>

<style>
.app {
  @apply font-base font-semibold text-sm;
}

.lh-btn {
  @apply border border-solid rounded-md font-bold bg-zinc-200 border-zinc-400/50 p-1 text-zinc-900 hover:bg-opacity-70 hover:border-opacity-100;
}
.lh-btn__green {
  @apply bg-emerald-200 border-green-600/50;
}
.lh-btn__red {
  @apply bg-red-200 border-red-600/50;
}
.lh-btn__yellow {
  @apply bg-amber-200 border-amber-600/50;
}
.lh-btn__teal {
  @apply bg-teal-300 border-teal-700/50;
}
.infoblock {
  @apply border-y border-l border-solid rounded-md font-bold bg-zinc-200 m-0 text-zinc-900 text-xs py-1 px-2;
}

.infoblock:first-child {
  @apply rounded-r-none;
}

.infoblock:last-child {
  @apply border-r rounded-l-none;
}
</style>
